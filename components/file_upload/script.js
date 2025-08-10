export default function(previewElement) {
    const dropZone = previewElement.querySelector('#drop-zone');
    const fileInput = previewElement.querySelector('#file-input');
    const previewContainer = previewElement.querySelector('#preview-container');

    if (!dropZone || !fileInput || !previewContainer) return;

    dropZone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        previewContainer.innerHTML = '';
        [...files].forEach(file => {
            displayPreview(file);
        });
    }

    function displayPreview(file) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item bg-white p-2 border border-gray-200 rounded-md shadow-sm';
        
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'flex items-center gap-3';
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'text-sm';

        const fileName = document.createElement('p');
        fileName.className = 'font-medium text-gray-800';
        fileName.textContent = file.name;

        const fileSize = document.createElement('p');
        fileSize.className = 'text-gray-500';
        fileSize.textContent = `${(file.size / 1024).toFixed(2)} KB`;
        
        fileInfo.appendChild(fileName);
        fileInfo.appendChild(fileSize);
        contentWrapper.appendChild(fileInfo);

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.className = 'w-12 h-12 object-cover rounded';
            const reader = new FileReader();
            reader.onload = (e) => { img.src = e.target.result; };
            reader.readAsDataURL(file);
            contentWrapper.prepend(img);
        } else {
            const fileIcon = document.createElement('div');
            fileIcon.className = 'w-12 h-12 flex items-center justify-center bg-gray-100 rounded';
            fileIcon.innerHTML = `<i data-lucide="file-text" class="w-6 h-6 text-gray-500"></i>`;
            contentWrapper.prepend(fileIcon);
        }
        
        previewItem.appendChild(contentWrapper);
        previewContainer.appendChild(previewItem);
        lucide.createIcons();
    }
    lucide.createIcons();
}
