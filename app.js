document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const app = new ComponentPlayground();
    app.init();
});

class ComponentPlayground {
    constructor() {
        this.gallery = document.getElementById('component-gallery');
        this.livePreviewArea = document.getElementById('live-preview-area');
        this.sidePanelTabs = document.getElementById('side-panel-tabs');
        this.sidePanelContent = document.getElementById('side-panel-content');
        this.exportPanel = document.getElementById('export-panel');
        this.componentStyleTag = null;
        this.activeComponent = null;
        this.activeTab = 'overview';
        this.componentCache = new Map();
        this.currentLesson = null;
        this.quizAnswerHandler = null;
        this.dataCache = {
            overview: null,
            html: null,
            css: null,
            js: null,
            props: null,
            quiz: null
        };
    }

    init() {
        this.setupEventListeners();
        this.loadAllData().then(() => {
            this.loadComponent('button');
        });
    }

    async loadAllData() {
        try {
            const [overview, html, css, js, props, quiz] = await Promise.all([
                fetch('data/overview.json').then(res => res.json()),
                fetch('data/html.json').then(res => res.json()),
                fetch('data/css.json').then(res => res.json()),
                fetch('data/js.json').then(res => res.json()),
                fetch('data/props.json').then(res => res.json()),
                fetch('data/quiz.json').then(res => res.json())
            ]);
            
            this.dataCache = { overview, html, css, js, props, quiz };
        } catch (error) {
            console.error('Failed to load educational data:', error);
        }
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
                this.updateActiveTab();
                this.renderLessonContent();
            }
        });
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
            
            let lesson;
            if (lessonRes.status === 'fulfilled' && lessonRes.value.ok) {
                lesson = await lessonRes.value.json();
            } else {
                console.warn(`Could not load components/${name}/lesson.json. Falling back to data/*.json files.`);
                lesson = this.buildLessonFromData(name);
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

    buildLessonFromData(componentName) {
        const lesson = {};
        
        if (this.dataCache.overview) {
            lesson.overview = this.dataCache.overview[componentName] || {};
        }
        
        if (this.dataCache.html) {
            lesson.html = this.dataCache.html[componentName] || {};
        }
        
        if (this.dataCache.css) {
            lesson.css = this.dataCache.css[componentName] || {};
        }
        
        if (this.dataCache.js) {
            lesson.js = this.dataCache.js[componentName] || {};
        }
        
        if (this.dataCache.props) {
            lesson.props = this.dataCache.props[componentName] || [];
        }
        
        if (this.dataCache.quiz) {
            lesson.quiz = this.dataCache.quiz[componentName] || {};
        }

        return lesson;
    }

    async loadComponent(name) {
        this.activeComponent = name;
        this.updateActiveComponentLink();

        const assets = await this.fetchComponentAssets(name);
        if (!assets) return;

        this.currentLesson = assets.lesson;
        this.injectHTML(assets.html);
        this.injectCSS(assets.css);
        this.handleTabsVisibility();
        this.handleProps();
        this.renderLessonContent();
        this.updateActiveTab();
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
    }
    
    handleTabsVisibility() {
        const jsTab = this.sidePanelTabs.querySelector('[data-tab="js"]');
        const quizTab = this.sidePanelTabs.querySelector('[data-tab="quiz"]');

        const hasJs = this.currentLesson.js && (this.currentLesson.js.code || this.currentLesson.js.content || this.currentLesson.js.description);
        jsTab.style.display = hasJs ? 'flex' : 'none';
        
        const hasQuiz = this.currentLesson.quiz && (this.currentLesson.quiz.questions && this.currentLesson.quiz.questions.length > 0);
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

    renderLessonContent() {
        if (this.quizAnswerHandler) {
            this.sidePanelContent.removeEventListener('click', this.quizAnswerHandler);
            this.quizAnswerHandler = null;
        }

        if (!this.currentLesson) {
            this.sidePanelContent.innerHTML = '<p>Content not available.</p>';
            return;
        }

        if (this.activeTab === 'props') {
            this.renderPropsPanel();
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

    handleProps() {
        const propsTab = this.sidePanelTabs.querySelector('[data-tab="props"]');
        const hasProps = this.currentLesson.props && this.currentLesson.props.length > 0;

        if (hasProps) {
            propsTab.style.display = 'flex';
            this.applyDefaultProps();
        } else {
            propsTab.style.display = 'none';
            if (this.activeTab === 'props') {
                this.activeTab = 'overview';
            }
        }
    }

    applyDefaultProps() {
        const props = this.currentLesson.props || [];
        props.forEach(prop => {
            this.updateProp(prop, prop.defaultValue);
        });
    }

    renderPropsPanel() {
        const props = this.currentLesson.props;
        if (!props || props.length === 0) {
            this.sidePanelContent.innerHTML = '<p class="p-4 text-gray-500">No adjustable properties for this component.</p>';
            return;
        }

        let controlsHtml = props.map(prop => {
            let inputHtml = '';
            const currentValue = this.getCurrentPropValue(prop) || prop.defaultValue;
            switch (prop.type) {
                case 'color':
                    inputHtml = `<input type="color" id="prop-${prop.name}" value="${currentValue}" class="w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer">`;
                    break;
                case 'text':
                default:
                    inputHtml = `<input type="text" id="prop-${prop.name}" value="${this.escapeHtml(currentValue)}" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">`;
                    break;
            }
            return `
                <div class="mb-4">
                    <label for="prop-${prop.name}" class="block text-sm font-medium text-gray-700 mb-1">${this.escapeHtml(prop.label)}</label>
                    ${inputHtml}
                </div>
            `;
        }).join('');

        this.sidePanelContent.innerHTML = `
            <div class="not-prose">
                <h3>Adjust Properties</h3>
                <p>Change the values below to see the component update in real-time.</p>
                <div class="mt-4">${controlsHtml}</div>
                <button id="reset-props-btn" class="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium">Reset to Default</button>
            </div>
        `;

        props.forEach(prop => {
            document.getElementById(`prop-${prop.name}`).addEventListener('input', (e) => {
                this.updateProp(prop, e.target.value);
            });
        });

        document.getElementById('reset-props-btn').addEventListener('click', () => {
            this.resetProps();
        });
    }
    
    getCurrentPropValue(prop) {
        const previewRoot = this.livePreviewArea.firstElementChild;
        if (!previewRoot) return null;

        if (prop.cssProperty) {
            return getComputedStyle(previewRoot).getPropertyValue(prop.cssProperty).trim();
        } else if (prop.attribute) {
            const target = prop.selector ? (previewRoot.matches(prop.selector) ? previewRoot : previewRoot.querySelector(prop.selector)) : previewRoot;
            return target ? target.getAttribute(prop.attribute) : null;
        } else if (prop.selector) {
            const targetElement = previewRoot.matches(prop.selector) ? previewRoot : previewRoot.querySelector(prop.selector);
            return targetElement ? targetElement.textContent : null;
        }
        return null;
    }

    updateProp(prop, value) {
        const previewRoot = this.livePreviewArea.firstElementChild;
        if (!previewRoot) return;

        if (prop.cssProperty) {
            previewRoot.style.setProperty(prop.cssProperty, value);
        } else if (prop.attribute) {
            const target = prop.selector ? (previewRoot.matches(prop.selector) ? previewRoot : previewRoot.querySelector(prop.selector)) : previewRoot;
            if(target) target.setAttribute(prop.attribute, value);
        } else if (prop.selector) {
            const targetElement = previewRoot.matches(prop.selector) ? previewRoot : previewRoot.querySelector(prop.selector);
            if (targetElement) {
                targetElement.textContent = value;
            }
        }
    }

    resetProps() {
        const props = this.currentLesson.props || [];
        props.forEach(prop => {
            this.updateProp(prop, prop.defaultValue);
            const inputEl = document.getElementById(`prop-${prop.name}`);
            if (inputEl) inputEl.value = prop.defaultValue;
        });
    }

    setupExportPanel() {
        const assets = this.componentCache.get(this.activeComponent);
        if (!assets) return;

        document.getElementById('copy-html-btn').onclick = () => this.copyCodeToClipboard('html', assets.html);
        document.getElementById('copy-css-btn').onclick = () => this.copyCodeToClipboard('css', assets.css);

        const copyJsBtn = document.getElementById('copy-js-btn');
        if (assets.js && assets.js.trim() !== '') {
            copyJsBtn.style.display = 'block';
            copyJsBtn.onclick = () => this.copyCodeToClipboard('js', assets.js);
        } else {
            copyJsBtn.style.display = 'none';
        }
        
        document.getElementById('copy-all-btn').onclick = () => {
            let allCode = `<!-- HTML -->\n${assets.html}\n\n`;
            allCode += `<style>\n/* CSS */\n${assets.css}\n</style>\n\n`;
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
