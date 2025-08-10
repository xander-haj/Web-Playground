export default function init(container) {
    if (!container) return;

    const toggleBtn = container.querySelector('#sidebar-toggle-btn');
    const sidebar = container.querySelector('#sidebar-component');
    const overlay = container.querySelector('#sidebar-overlay');

    if (!toggleBtn || !sidebar || !overlay) return;

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('open');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener('click', closeSidebar);

    lucide.createIcons();
}
