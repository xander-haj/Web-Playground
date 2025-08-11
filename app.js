import { CSSEditor } from './css_editor/css_editor.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const app = new ComponentPlayground();
    app.init();
});

class ComponentPlayground {
    constructor() {
        this.gallery = document.getElementById('component-gallery');
        this.livePreviewArea = document.getElementById('live-preview-area');
        this.sidePanel = document.getElementById('side-panel');
        this.sidePanelTabs = document.getElementById('side-panel-tabs');
        this.sidePanelContent = document.getElementById('side-panel-content');
        this.exportPanel = document.getElementById('export-panel');
        
        this.cssEditorContainer = null;
        this.componentStyleTag = null;
        this.activeComponent = null;
        this.activeTab = 'overview';
        this.componentCache = new Map();
        this.currentLesson = null;
        this.quizAnswerHandler = null;
        
        this.cssEditMode = false;
        this.cssEditor = null;
        this.cssEditModeToggle = document.getElementById('css-edit-mode-toggle');
    }

    init() {
        this.cssEditorContainer = document.createElement('div');
        this.cssEditorContainer.id = 'css-editor-container';
        this.sidePanel.insertBefore(this.cssEditorContainer, this.sidePanelContent);

        this.cssEditor = new CSSEditor(this.cssEditorContainer, this.livePreviewArea);
        this.setupEventListeners();
        this.loadComponent('button');
    }

    setupEventListeners() {
        this.gallery.addEventListener('click', e => {
            e.preventDefault();
            const link = e.target.closest('.component-link');
            if (link && link.dataset.component) {
                const componentName = link.dataset.component;
                if (componentName !== this.activeComponent) {
                    this.loadComponent(componentName);
                }
            }
        });

        this.sidePanelTabs.addEventListener('click', e => {
            const tabButton = e.target.closest('.side-panel-tab');
            if (tabButton && tabButton.dataset.tab) {
                this.activeTab = tabButton.dataset.tab;
                this.renderSidePanel();
            }
        });
        
        if (this.cssEditModeToggle) {
            this.cssEditModeToggle.addEventListener('click', () => {
                this.toggleCssEditMode();
            });
        }
    }
    
    toggleCssEditMode() {
        this.cssEditMode = !this.cssEditMode;
        this.sidePanel.classList.toggle('css-editor-active', this.cssEditMode);
        this.updateCssEditModeButton();
        this.renderSidePanel();
    }

    updateCssEditModeButton() {
        if (!this.cssEditModeToggle) {
            return;
        }

        this.cssEditModeToggle.classList.toggle('bg-green-600', this.cssEditMode);
        this.cssEditModeToggle.classList.toggle('hover:bg-green-700', this.cssEditMode);
        this.cssEditModeToggle.classList.toggle('bg-indigo-600', !this.cssEditMode);
        this.cssEditModeToggle.classList.toggle('hover:bg-indigo-700', !this.cssEditMode);

        const icon = this.cssEditModeToggle.querySelector('[data-lucide]');
        const text = this.cssEditModeToggle.querySelector('span');
        
        if (icon) {
            if (this.cssEditMode) {
                icon.setAttribute('data-lucide', 'x-circle');
            } else {
                icon.setAttribute('data-lucide', 'paintbrush-2');
            }
        }
        
        if (text) {
            if (this.cssEditMode) {
                text.textContent = 'Exit Edit Mode';
            } else {
                text.textContent = 'CSS Edit Mode';
            }
        }
        lucide.createIcons();
    }

    async fetchComponentAssets(name) {
        if (this.componentCache.has(name)) {
            return this.componentCache.get(name);
        }

        try {
            const [htmlRes, cssRes, jsRes, lessonRes] = await Promise.allSettled([
                fetch(`components/${name}/index.html`),
                fetch(`components/${name}/style.css`),
                fetch(`components/${name}/script.js`),
                fetch(`components/${name}/lesson.json`)
            ]);

            const html = htmlRes.status === 'fulfilled' && htmlRes.value.ok ? await htmlRes.value.text() : `<p class="text-red-500">Error loading HTML for ${name}.</p>`;
            const css = cssRes.status === 'fulfilled' && cssRes.value.ok ? await cssRes.value.text() : '';
            const js = jsRes.status === 'fulfilled' && jsRes.value.ok ? await jsRes.value.text() : '';
            
            let lesson = {};
            if (lessonRes.status === 'fulfilled' && lessonRes.value.ok) {
                try {
                    lesson = await lessonRes.value.json();
                } catch (e) {
                    console.error(`Failed to parse lesson.json for ${name}:`, e);
                    lesson = { overview: { title: "Lesson Error", description: `Could not parse lesson.json for ${name}.` } };
                }
            } else {
                console.warn(`Could not load components/${name}/lesson.json.`);
            }

            const assets = { html, css, lesson, js };
            this.componentCache.set(name, assets);
            return assets;
        } catch (error) {
            console.error(`Failed to load assets for component: ${name}`, error);
            this.livePreviewArea.innerHTML = `<p class="text-red-500">Error loading component: ${name}.</p>`;
            return null;
        }
    }

    async loadComponent(name) {
        this.activeComponent = name;
        this.updateActiveComponentLink();

        const assets = await this.fetchComponentAssets(name);
        if (!assets) return;

        this.currentLesson = assets.lesson;
        this.injectHTML(assets.html);
        this.injectCSS(assets.css);
        

        this.cssEditor.render(this.activeComponent, assets.css, this.componentStyleTag);

        this.handleTabsVisibility();
        this.setupExportPanel();
        
        try {
            const componentModule = await import(`./components/${name}/script.js?v=${new Date().getTime()}`);
            if (componentModule.default) {
                const previewElement = this.livePreviewArea;
                if (typeof componentModule.default === 'function') {
                     if (componentModule.default.toString().startsWith('class')) {
                        new componentModule.default(previewElement);
                     } else {
                        componentModule.default(previewElement);
                     }
                }
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch dynamically imported module')) {
                console.info(`No script.js found for component: ${name}`);
            } else {
                console.error(`Error loading script for component ${name}:`, error);
            }
        }
        
        this.renderSidePanel();
    }
    
    handleTabsVisibility() {
        const jsTab = this.sidePanelTabs.querySelector('[data-tab=\"js\"]');
        const quizTab = this.sidePanelTabs.querySelector('[data-tab=\"quiz\"]');

        const hasJs = this.currentLesson && this.currentLesson.js && (this.currentLesson.js.code || this.currentLesson.js.content || this.currentLesson.js.description);
        jsTab.style.display = hasJs ? 'flex' : 'none';
        
        const hasQuiz = this.currentLesson && this.currentLesson.quiz && (this.currentLesson.quiz.questions && this.currentLesson.quiz.questions.length > 0);
        quizTab.style.display = hasQuiz ? 'flex' : 'none';

        if ((!hasJs && this.activeTab === 'js') || (!hasQuiz && this.activeTab === 'quiz')) {
            this.activeTab = 'overview';
        }
    }

    injectHTML(html) {
        this.livePreviewArea.innerHTML = html;
    }

    injectCSS(css) {
        if (!this.componentStyleTag) {
            this.componentStyleTag = document.createElement('style');
            this.componentStyleTag.id = 'component-specific-styles';
            document.head.appendChild(this.componentStyleTag);
        }
        this.componentStyleTag.textContent = css;
    }

    renderSidePanel() {
        if (this.cssEditMode) {
             this.cssEditor.render(this.activeComponent, this.componentCache.get(this.activeComponent)?.css || '', this.componentStyleTag);
        } else {
            this.updateActiveTab();
            this.renderLessonContent();
        }
    }

    renderLessonContent() {
        if (this.quizAnswerHandler) {
            this.sidePanelContent.removeEventListener('click', this.quizAnswerHandler);
            this.quizAnswerHandler = null;
        }

        if (!this.currentLesson) {
            this.sidePanelContent.innerHTML = '<p>Content not available.</p>';
            return;
        }

        if (this.activeTab === 'quiz') {
            const contentData = this.currentLesson.quiz;
            if (contentData && contentData.questions && contentData.questions.length > 0) {
                this.renderQuizPanel(contentData);
            } else {
                this.sidePanelContent.innerHTML = '<p>No quiz available for this component.</p>';
            }
            return;
        }

        const contentData = this.currentLesson[this.activeTab];
        if (!contentData) {
            this.sidePanelContent.innerHTML = '<p>Content not available for this tab.</p>';
            return;
        }

        let htmlContent = `<h3>${this.escapeHtml(contentData.title || '')}</h3>`;
        htmlContent += `<p>${this.escapeHtml(contentData.description || contentData.content || '')}</p>`;

        if (this.activeTab === 'best-practices' && contentData.points) {
            htmlContent += `<ul class="list-disc space-y-2 mt-4">${contentData.points.map(point => `<li>${this.escapeHtml(point)}</li>`).join('')}</ul>`;
        } else if (contentData.points) {
            htmlContent += `<ul>${contentData.points.map(point => `<li>${this.escapeHtml(point)}</li>`).join('')}</ul>`;
        }

        if (contentData.code) {
            htmlContent += `<pre class="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm"><code>${this.escapeHtml(contentData.code)}</code></pre>`;
        }

        this.sidePanelContent.innerHTML = htmlContent;
    }

    renderQuizPanel(contentData) {
        let htmlContent = `<h3>${this.escapeHtml(contentData.title || 'Quiz')}</h3>`;
        if (contentData.description) {
            htmlContent += `<p>${this.escapeHtml(contentData.description)}</p>`;
        }
    
        contentData.questions.forEach((q, questionIndex) => {
            htmlContent += `<div class="quiz-question mt-6" data-question-index="${questionIndex}">`;
            htmlContent += `<p class="font-semibold">${this.escapeHtml(q.question)}</p>`;
            if (q.answers && q.answer) {
                htmlContent += `<div class="mt-3 space-y-2 flex flex-col items-start">`;
                htmlContent += q.answers.map((opt, optionIndex) => 
                    `<button 
                        class="quiz-option-btn w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                        data-option-index="${optionIndex}">
                        ${this.escapeHtml(opt)}
                    </button>`
                ).join('');
                htmlContent += `</div>`;
            }
            htmlContent += `</div>`;
        });
    
        this.sidePanelContent.innerHTML = htmlContent;
        
        this.quizAnswerHandler = this.handleQuizAnswer.bind(this);
        this.sidePanelContent.addEventListener('click', this.quizAnswerHandler);
    }
    
    handleQuizAnswer(e) {
        const button = e.target.closest('.quiz-option-btn');
        if (!button || button.disabled) {
            return;
        }
    
        const questionDiv = button.closest('.quiz-question');
        if (!questionDiv) return;
    
        const questionIndex = parseInt(questionDiv.dataset.questionIndex, 10);
        const optionIndex = parseInt(button.dataset.optionIndex, 10);
    
        const questionData = this.currentLesson.quiz.questions[questionIndex];
        if (!questionData) return;
    
        const correctIndex = questionData.answers.indexOf(questionData.answer);
    
        const optionButtons = questionDiv.querySelectorAll('.quiz-option-btn');
        
        optionButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('hover:bg-gray-100', 'focus:ring-indigo-500', 'focus:ring-offset-2');
        });
    
        if (optionIndex === correctIndex) {
            button.classList.add('bg-green-100', 'border-green-400', 'text-green-900', 'font-semibold');
        } else {
            button.classList.add('bg-red-100', 'border-red-400', 'text-red-900', 'font-semibold');
            if (correctIndex > -1 && optionButtons[correctIndex]) {
                const correctButton = optionButtons[correctIndex];
                correctButton.classList.add('bg-green-100', 'border-green-400', 'text-green-900', 'font-semibold');
            }
        }
    }

    setupExportPanel() {
        const assets = this.componentCache.get(this.activeComponent);
        if (!assets) return;

        document.getElementById('copy-html-btn').onclick = () => this.copyCodeToClipboard('html', assets.html);
        document.getElementById('copy-css-btn').onclick = () => this.copyCodeToClipboard('css', this.cssEditor.componentCss || assets.css);

        const copyJsBtn = document.getElementById('copy-js-btn');
        if (assets.js && assets.js.trim() !== '') {
            copyJsBtn.style.display = 'block';
            copyJsBtn.onclick = () => this.copyCodeToClipboard('js', assets.js);
        } else {
            copyJsBtn.style.display = 'none';
        }
        
        document.getElementById('copy-all-btn').onclick = () => {
            const finalCss = this.cssEditor.componentCss || assets.css;
            let allCode = `<!-- HTML -->\n${assets.html}\n\n`;
            allCode += `<style>\n/* CSS */\n${finalCss}\n</style>\n\n`;
            if (assets.js && assets.js.trim() !== '') {
                allCode += `<script type="module">\n/* JS */\n${assets.js}\n</script>`;
            }
            this.copyCodeToClipboard('all', allCode.trim());
        };
    }

    copyCodeToClipboard(type, content) {
        navigator.clipboard.writeText(content).then(() => {
            const button = document.getElementById(`copy-${type}-btn`);
            if(!button) return;
            const originalText = button.innerHTML;
            button.textContent = 'Copied!';
            button.classList.add('bg-green-100', 'border-green-400');
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('bg-green-100', 'border-green-400');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy code.');
        });
    }

    updateActiveComponentLink() {
        this.gallery.querySelectorAll('.component-link').forEach(link => {
            link.classList.toggle('active', link.dataset.component === this.activeComponent);
        });
    }

    updateActiveTab() {
        this.sidePanelTabs.querySelectorAll('.side-panel-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === this.activeTab);
        });
    }

    escapeHtml(str) {
        if (typeof str !== 'string') return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(new RegExp('[&<>"\']', 'g'), m => map[m]);
    }
}
