export default function(previewElement) {
    const radioButtons = previewElement.querySelectorAll('input[name="options"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                console.log('Selected option:', e.target.value);
            }
        });
    });
}
