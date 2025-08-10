export default function init(container) {
    if (!container) return;

    const prevBtn = container.querySelector('#stepper-prev-btn');
    const nextBtn = container.querySelector('#stepper-next-btn');
    const steps = container.querySelectorAll('.stepper-step');
    const contentEl = container.querySelector('#stepper-content');
    const totalSteps = steps.length;
    let currentStep = 1;

    const stepContent = [
        "Content for Step 1: Please provide your shipping information.",
        "Content for Step 2: Enter your payment details.",
        "Content for Step 3: Review and confirm your order."
    ];

    function updateStepper() {
        steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            if (stepNum < currentStep) {
                step.classList.add('is-complete');
                step.classList.remove('is-active');
            } else if (stepNum === currentStep) {
                step.classList.add('is-active');
                step.classList.remove('is-complete');
            } else {
                step.classList.remove('is-active', 'is-complete');
            }
        });

        prevBtn.disabled = currentStep === 1;
        nextBtn.disabled = currentStep === totalSteps;

        if (currentStep === totalSteps) {
            nextBtn.textContent = 'Finish';
        } else {
            nextBtn.textContent = 'Next';
        }
        
        contentEl.textContent = stepContent[currentStep - 1];
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepper();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepper();
        }
    });

    updateStepper();
}
