export default function initDropdown(container) {
    const dropdownContainer = container.querySelector('[data-dropdown-container]');
    if (!dropdownContainer) return;

    const button = dropdownContainer.querySelector('[data-dropdown-button]');
    const menu = dropdownContainer.querySelector('[data-dropdown-menu]');

    if (!button || !menu) return;

    const closeOnClickOutside = (event) => {
        if (!dropdownContainer.contains(event.target)) {
            closeMenu();
        }
    };

    const openMenu = () => {
        menu.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        document.addEventListener('click', closeOnClickOutside);
    };

    const closeMenu = () => {
        menu.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeOnClickOutside);
    };

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = menu.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    closeMenu();
}
