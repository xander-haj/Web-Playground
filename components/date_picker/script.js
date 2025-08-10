export default function(previewElement) {
    const dateInput = previewElement.querySelector('#appointment-date');
    const timeInput = previewElement.querySelector('#appointment-time');

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    dateInput.min = todayString;

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];

    dateInput.addEventListener('change', (e) => {
        if (!e.target.value) return;
        console.log('Selected date:', e.target.value);
    });

    timeInput.addEventListener('change', (e) => {
        const selectedTime = e.target.value;
        console.log('Selected time:', selectedTime);
    });
}
