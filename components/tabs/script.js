export default function(previewElement) {
    previewElement.querySelectorAll('.tabs-container').forEach(container => {
        if (!container.tabManager) {
            container.tabManager = new TabManager(container);
        }
    });
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

class TabManager {
    constructor(tabContainer) {
        if (!tabContainer) return;
        this.container = tabContainer;
        this.isVertical = this.container.classList.contains('tabs-vertical');
        this.tabs = Array.from(this.container.querySelectorAll('[role="tab"]'));
        this.panels = [];
        this.init();
    }

    init() {
        this.tabs.forEach((tab, index) => {
            const panelId = tab.getAttribute('aria-controls');
            const panel = this.container.querySelector(`#${panelId}`);
            if (panel) {
                this.panels.push(panel);
                panel.setAttribute('aria-labelledby', tab.id);
            }

            tab.addEventListener('click', () => {
                this.activateTab(index);
            });
        });
    }

    activateTab(index) {
        if (index < 0 || index >= this.tabs.length) return;

        this.tabs.forEach((tab, i) => {
            const isActive = i === index;
            tab.setAttribute('aria-selected', isActive);
            tab.setAttribute('tabindex', isActive ? '0' : '-1');

            if (this.isVertical) {
                tab.classList.toggle('text-indigo-600', isActive);
                tab.classList.toggle('bg-indigo-50', isActive);
                tab.classList.toggle('text-gray-600', !isActive);
            } else {
                tab.classList.toggle('text-indigo-600', isActive);
                tab.classList.toggle('border-indigo-500', isActive);
                tab.classList.toggle('text-gray-500', !isActive);
                tab.classList.toggle('border-transparent', !isActive);
            }
        });

        const activeTab = this.tabs[index];
        const activePanelId = activeTab.getAttribute('aria-controls');
        this.panels.forEach(panel => {
            panel.hidden = panel.id !== activePanelId;
        });
    }
}
