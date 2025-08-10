export default function(previewElement) {
  const nav = previewElement.querySelector('.breadcrumb-nav');
  if (!nav) return;

  nav.addEventListener('click', (event) => {
    const link = event.target.closest('.breadcrumb-link');
    if (!link) return;
    event.preventDefault();

    const list = nav.querySelector('ol');
    const items = Array.from(list.querySelectorAll('.breadcrumb-item'));
    const clickedItem = link.closest('.breadcrumb-item');
    const index = items.indexOf(clickedItem);
    if (index === -1) return;

    for (let i = items.length - 1; i > index; i--) {
      items[i].remove();
    }

    const span = document.createElement('span');
    span.className = 'breadcrumb-current';
    span.setAttribute('aria-current', 'page');
    span.textContent = link.textContent.trim();
    link.replaceWith(span);

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  });

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}
