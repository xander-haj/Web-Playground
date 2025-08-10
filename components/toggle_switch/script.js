export default function(previewElement) {
    const toggleSwitch = previewElement.querySelector('#toggle-switch-btn');
    if (!toggleSwitch) return;

    toggleSwitch.addEventListener('click', () => {
        const isChecked = toggleSwitch.getAttribute('aria-checked') === 'true';
        const newState = !isChecked;

        toggleSwitch.setAttribute('aria-checked', newState.toString());
        
        const srText = toggleSwitch.querySelector('.sr-only');
        if (srText) {
            srText.textContent = newState ? 'Disable Notifications' : 'Enable Notifications';
        }
        
        console.log('Notifications are now:', newState ? 'enabled' : 'disabled');
    });
}
