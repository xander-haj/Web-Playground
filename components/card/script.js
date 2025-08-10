export default function(previewElement) {
  const button = previewElement.querySelector('.card .card-footer button');
  const card = previewElement.querySelector('.card');
  if (button && card) {
    button.addEventListener('click', () => {
      const expanded = card.classList.toggle('is-expanded');
      console.log(expanded ? 'Card expanded' : 'Card collapsed');
      button.textContent = expanded ? 'Show Less ←' : 'Read More →';
    });
  }
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}
