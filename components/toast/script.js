export default function init(container) {
    if (!container) return;

    const triggerBtn = container.querySelector('#toast-trigger-btn');
    const toastContainer = container.querySelector('#toast-container');

    if (!triggerBtn || !toastContainer) return;

    let toastCount = 0;

    function createToast() {
        toastCount++;
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        
        toast.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <i data-lucide="check-circle" class="h-5 w-5 text-green-400"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-white">Success!</p>
                    <p class="mt-1 text-sm text-gray-300">Your action was completed. (${toastCount})</p>
                </div>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    }

    triggerBtn.addEventListener('click', createToast);
}
