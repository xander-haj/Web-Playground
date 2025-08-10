export default function init(container) {
    if (!container) return;

    const pages = container.querySelectorAll('.pagination-page');
    const arrows = container.querySelectorAll('.pagination-arrow');
    let currentPage = 1;
    const totalPages = 10;

    function updateActiveState() {
        pages.forEach(page => {
            if (parseInt(page.dataset.page) === currentPage) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        arrows.forEach(arrow => {
            const action = arrow.dataset.page;
            if (action === 'prev') {
                arrow.classList.toggle('disabled', currentPage === 1);
            } else if (action === 'next') {
                arrow.classList.toggle('disabled', currentPage === totalPages);
            }
        });
        lucide.createIcons();
    }

    container.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.closest('a');
        if (!target) return;

        const pageAction = target.dataset.page;
        if (pageAction === 'prev') {
            if (currentPage > 1) {
                currentPage--;
            }
        } else if (pageAction === 'next') {
            if (currentPage < totalPages) {
                currentPage++;
            }
        } else {
            const pageNum = parseInt(pageAction);
            if (!isNaN(pageNum)) {
                currentPage = pageNum;
            }
        }
        updateActiveState();
    });

    updateActiveState();
}
