export default function initialize(container) {
  if (!container) return;

  const buttons = container.querySelectorAll('.accordion-button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const panelId = button.getAttribute('aria-controls');
      if (!panelId) return;
      
      const panel = document.getElementById(panelId);
      if (!panel) return;

      button.setAttribute('aria-expanded', !isExpanded);
      
      if (isExpanded) {
        panel.setAttribute('hidden', '');
      } else {
        panel.removeAttribute('hidden');
      }
    });
  });
}
