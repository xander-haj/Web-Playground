export default function(previewElement) {
  const badges = previewElement.querySelectorAll('.badge');
  badges.forEach(badge => {
    badge.addEventListener('click', () => {
      console.log('Badge clicked:', badge.textContent.trim());
      badge.classList.toggle('badge-dot');
    });
  });
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}
