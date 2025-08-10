export default function(previewElement) {
    const table = previewElement.querySelector('table');
    if (table) {
        new InteractiveTable(table);
    }
}

class InteractiveTable {
    constructor(tableElement) {
        this.table = tableElement;
        this.tbody = this.table.querySelector('tbody');
        this.thead = this.table.querySelector('thead');
        if (!this.tbody || !this.thead) return;

        this.rows = Array.from(this.tbody.querySelectorAll('tr'));
        this.currentSort = { column: -1, direction: 'asc' };
        this.init();
    }

    init() {
        this.addSortingToHeaders();
    }

    addSortingToHeaders() {
        const headers = this.thead.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (header.hasAttribute('data-sortable')) {
                header.style.cursor = 'pointer';
                if (!header.querySelector('.sort-indicator')) {
                    header.innerHTML += ' <span class="sort-indicator text-gray-400">↕</span>';
                }
                header.addEventListener('click', () => this.sortTable(index));
            }
        });
    }

    sortTable(columnIndex) {
        const isAscending = this.currentSort.column !== columnIndex || this.currentSort.direction === 'desc';
        const direction = isAscending ? 'asc' : 'desc';

        this.rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();
            
            const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ""));
            const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ""));

            let comparison = 0;
            if (!isNaN(aNum) && !isNaN(bNum)) {
                comparison = aNum - bNum;
            } else {
                comparison = aValue.localeCompare(bValue);
            }
            return isAscending ? comparison : -comparison;
        });

        this.tbody.innerHTML = '';
        this.rows.forEach(row => this.tbody.appendChild(row));
        this.updateSortIndicators(columnIndex, direction);
        this.currentSort = { column: columnIndex, direction };
    }

    updateSortIndicators(activeColumn, direction) {
        const headers = this.thead.querySelectorAll('th');
        headers.forEach((header, index) => {
            const indicator = header.querySelector('.sort-indicator');
            if (indicator) {
                if (index === activeColumn) {
                    indicator.textContent = direction === 'asc' ? '↑' : '↓';
                    indicator.classList.remove('text-gray-400');
                } else {
                    indicator.textContent = '↕';
                    indicator.classList.add('text-gray-400');
                }
            }
        });
    }
}
