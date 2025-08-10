export default function(previewElement) {
    const links = previewElement.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Link clicked! (Navigation prevented in this demo)');
        });
    });
}
