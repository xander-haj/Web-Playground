export default function(previewElement) {
    const myButton = previewElement.querySelector('.btn');
    if (myButton) {
        myButton.addEventListener('click', () => {
            alert('Button was clicked!');
        });
    }
}
