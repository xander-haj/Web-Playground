export default function(previewElement) {
    const container = previewElement.querySelector('.multi-select-container');
    if (container) {
        new MultiSelectDropdown(container);
    }
    lucide.createIcons();
}

class MultiSelectDropdown {
    constructor(container) {
        this.container = container;
        this.toggle = container.querySelector('#multi-select-toggle');
        this.toggleText = this.toggle.querySelector('span');
        this.panel = container.querySelector('#multi-select-panel');
        this.display = container.querySelector('#selected-items-display');
        this.selectedItems = new Set();
        this.isOpen = false;

        this.options = [
            { id: 'apple', label: 'Apple' },
            { id: 'banana', label: 'Banana' },
            { id: 'cherry', label: 'Cherry' },
            { id: 'date', label: 'Date' },
            { id: 'elderberry', label: 'Elderberry' }
        ];

        this.init();
    }

    init() {
        this.renderOptions();
        this.setupEventListeners();
        this.updateDisplay();
    }

    renderOptions() {
        this.panel.innerHTML = '';
        const optionList = document.createElement('ul');
        optionList.className = 'max-h-60 overflow-auto p-2';

        this.options.forEach(option => {
            const optionItem = document.createElement('li');
            optionItem.className = 'multi-select-option p-2 rounded-md hover:bg-indigo-50 cursor-pointer';
            optionItem.innerHTML = `
        <label class="flex items-center w-full cursor-pointer">
          <input type="checkbox" id="option-${option.id}" value="${option.id}" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
          <span class="ml-3 text-sm text-gray-700">${option.label}</span>
        </label>
      `;

            const checkbox = optionItem.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedItems.add(option.id);
                } else {
                    this.selectedItems.delete(option.id);
                }
                this.updateDisplay();
            });
            optionList.appendChild(optionItem);
        });
        this.panel.appendChild(optionList);
    }

    setupEventListeners() {
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && this.isOpen) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        this.isOpen ? this.closeDropdown() : this.openDropdown();
    }

    openDropdown() {
        this.isOpen = true;
        this.panel.hidden = false;
        this.toggle.setAttribute('aria-expanded', 'true');
    }

    closeDropdown() {
        this.isOpen = false;
        this.panel.hidden = true;
        this.toggle.setAttribute('aria-expanded', 'false');
    }

    updateDisplay() {
        if (this.selectedItems.size === 0) {
            this.toggleText.textContent = 'Select Fruits';
        } else if (this.selectedItems.size === 1) {
            const singleId = [...this.selectedItems][0];
            const option = this.options.find(opt => opt.id === singleId);
            this.toggleText.textContent = option.label;
        } else {
            this.toggleText.textContent = `${this.selectedItems.size} selected`;
        }

        this.display.innerHTML = '';
        this.selectedItems.forEach(itemId => {
            const option = this.options.find(opt => opt.id === itemId);
            if (option) {
                const pill = document.createElement('span');
                pill.className = 'selected-item-pill';
                pill.innerHTML = `
          ${option.label}
          <button type="button" data-id="${option.id}" aria-label="Remove ${option.label}">
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
        `;
                this.display.appendChild(pill);
            }
        });

        this.display.querySelectorAll('button').forEach(removeBtn => {
            removeBtn.addEventListener('click', (e) => {
                const idToRemove = removeBtn.dataset.id;
                this.selectedItems.delete(idToRemove);
                const checkbox = this.panel.querySelector(`#option-${idToRemove}`);
                if (checkbox) checkbox.checked = false;
                this.updateDisplay();
            });
        });
        
        lucide.createIcons();
    }
}
