export default function(previewElement) {
    const checkboxes = previewElement.querySelectorAll('.custom-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const label = previewElement.querySelector(`label[for="${e.target.id}"]`);
            const labelText = label ? label.textContent.trim() : 'Unnamed checkbox';
            console.log(`${labelText} is now:`, e.target.checked ? 'checked' : 'unchecked');
        });
    });
}
