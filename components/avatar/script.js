export default function(previewElement) {
  const avatars = previewElement.querySelectorAll('.avatar');
  avatars.forEach(avatar => {
    avatar.addEventListener('click', () => {
      const status = avatar.querySelector('.avatar-status');
      if (!status) return;
      if (status.classList.contains('status-online')) {
        status.classList.remove('status-online');
        status.classList.add('status-offline');
        console.log('Avatar status set to offline');
      } else {
        status.classList.remove('status-offline');
        status.classList.add('status-online');
        console.log('Avatar status set to online');
      }
    });
  });

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}
