export default function(previewElement) {
    const slider = previewElement.querySelector('#volume-slider');
    const output = previewElement.querySelector('#volume-output');
    
    if (slider && output) {
        slider.addEventListener('input', (e) => {
            output.value = e.target.value;
        });

        slider.addEventListener('change', (e) => {
            console.log('Final volume level:', e.target.value);
        });
    }
}
