import { componentDefinitions } from './component_definitions.js';

export class CSSEditor {
    constructor(panelElement, livePreviewElement) {
        this.panel = panelElement;
        this.preview = livePreviewElement;
        this.componentName = null;
        this.componentCss = null;
        this.styleTag = null;
    }

    render(componentName, cssText, styleTag) {
        if (this.componentName !== componentName) {
            this.componentName = componentName;
            this.componentCss = cssText;
        }
        
        this.styleTag = styleTag;

        const definitions = componentDefinitions[this.componentName];

        if (!definitions) {
            this.panel.innerHTML = `
                <div class="p-4 text-center">
                    <h3 class="text-lg font-semibold text-gray-800">CSS Editor</h3>
                    <p class="text-gray-500 mt-2">No editor configuration found for the <strong class="font-semibold text-indigo-600">${this.componentName}</strong> component.</p>
                </div>
            `;
            return;
        }

        const cssVars = this.extractCssVariables(this.componentCss);
        let controlsHtml = this.createControls(definitions, cssVars);
        
        const selectorInfo = definitions.selector ? `<p class="text-sm text-gray-600 mt-1">Target selector: <code class="text-xs bg-gray-200 text-pink-600 px-1 py-0.5 rounded">${definitions.selector}</code></p>` : '';

        this.panel.innerHTML = `
            <div class="not-prose p-0 h-full flex flex-col">
                <div class="bg-gray-50 p-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-800">CSS Editor: <span class="capitalize text-indigo-600">${this.componentName}</span></h3>
                    ${selectorInfo}
                </div>
                <div class="p-4 space-y-6 flex-1 overflow-y-auto">${controlsHtml}</div>
            </div>
        `;
        this.attachEventListeners(definitions);
    }

    extractCssVariables(cssText) {
        const variables = new Map();
        if (!cssText) return variables;

        const noComments = cssText.replace(new RegExp('/\\*[\\s\\S]*?\\*/', 'g'), '');
        const varRegex = new RegExp('--([a-zA-Z0-9-]+)\\s*:\\s*([^;}]+)', 'g');

        let match;
        while ((match = varRegex.exec(noComments)) !== null) {
            variables.set(`--${match[1].trim()}`, match[2].trim());
        }
        return variables;
    }

    createControls(definitions, cssVars) {
        let cssControls = '';
        if (definitions.css) {
            cssControls = definitions.css.map(def => {
                const initialValue = cssVars.get(def.name) || '';
                return this.createControl(def, initialValue, 'css');
            }).join('');
        }

        let textControls = '';
        if (definitions.text) {
            textControls = definitions.text.map(def => {
                const element = this.preview.querySelector(def.selector);
                const initialValue = element ? element.textContent.trim() : '';
                return this.createControl(def, initialValue, 'text');
            }).join('');
        }
        
        let finalHtml = '';
        if (cssControls) {
            finalHtml += `<div class="border-b pb-4 mb-4 border-gray-200"><h4 class="text-xs font-bold uppercase text-gray-500 mb-3">Styles</h4>${cssControls}</div>`;
        }
        if (textControls) {
            finalHtml += `<div><h4 class="text-xs font-bold uppercase text-gray-500 mb-3">Content</h4>${textControls}</div>`;
        }
        
        return finalHtml;
    }

    createControl(def, initialValue, type) {
        const id = `${type}-control-${def.name || def.selector.replace(/[^a-zA-Z0-9]/g, '')}`;
        let inputHtml = '';
        const controlType = def.type || 'text';

        switch (controlType) {
            case 'color':
                inputHtml = `<input type="color" id="${id}" value="${initialValue}" class="w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer">`;
                break;
            case 'range':
                const unit = def.unit || '';
                const min = def.min ?? 0;
                const max = def.max ?? 100;
                const step = def.step || 1;
                const currentValue = parseFloat(initialValue) || min;
                inputHtml = `
                    <div class="flex items-center gap-2">
                        <input type="range" id="${id}" value="${currentValue}" min="${min}" max="${max}" step="${step}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                        <span id="${id}-value" class="text-sm font-mono text-gray-600 w-20 text-right">${currentValue}${unit}</span>
                    </div>
                `;
                break;
            case 'text':
            default:
                inputHtml = `<input type="text" id="${id}" value="${initialValue}" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono">`;
                break;
        }

        return `
            <div class="mb-4">
                <label for="${id}" class="block text-sm font-medium text-gray-700 mb-1">${def.label}</label>
                ${inputHtml}
            </div>
        `;
    }

    updateCssVariableInStyleTag(name, value) {
        if (!this.styleTag || this.componentCss === null) return;
    
        const regex = new RegExp(`(${name})(\\s*:\\s*)([^;}]+)(;?)`);
    
        if (regex.test(this.componentCss)) {
            const newCssText = this.componentCss.replace(regex, `$1$2${value}$4`);
            this.componentCss = newCssText;
            this.styleTag.textContent = newCssText;
        } else {
            console.warn(`CSS variable "${name}" not found in the stylesheet for ${this.componentName}. Cannot update.`);
        }
    }

    attachEventListeners(definitions) {
        if (definitions.css) {
            definitions.css.forEach(def => {
                const id = `css-control-${def.name}`;
                const control = this.panel.querySelector(`#${id}`);
                if (control) {
                    control.addEventListener('input', (e) => {
                        let value = e.target.value;
                         if (def.type === 'range') {
                            const unit = def.unit || '';
                            const output = this.panel.querySelector(`#${id}-value`);
                            if (output) output.textContent = `${value}${unit}`;
                            value = `${value}${unit}`;
                        }
                        this.updateCssVariableInStyleTag(def.name, value);
                    });
                }
            });
        }

        if (definitions.text) {
            definitions.text.forEach(def => {
                const id = `text-control-${def.selector.replace(/[^a-zA-Z0-9]/g, '')}`;
                const control = this.panel.querySelector(`#${id}`);
                if (control) {
                    control.addEventListener('input', (e) => {
                        const elementToUpdate = this.preview.querySelector(def.selector);
                        if (elementToUpdate) {
                            elementToUpdate.textContent = e.target.value;
                        }
                    });
                }
            });
        }
    }
}
