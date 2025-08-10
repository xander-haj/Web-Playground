export default function(previewElement) {
    const dialog = previewElement.querySelector('#example-modal');
    const openBtn = previewElement.querySelector('#open-modal-btn');
    const closeBtn = previewElement.querySelector('#close-modal-btn');
    
    if (dialog && openBtn && closeBtn) {
        openBtn.addEventListener('click', () => {
          dialog.showModal();
        });
        
        closeBtn.addEventListener('click', () => {
          dialog.close();
        });
        
        dialog.addEventListener('click', (e) => {
            const dialogDimensions = dialog.getBoundingClientRect()
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                dialog.close()
            }
        });
    }
}
