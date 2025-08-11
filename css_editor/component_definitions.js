export const componentDefinitions = {
    'button': {
        selector: '.btn',
        css: [
            { name: '--btn-bg-color', label: 'Background Color', type: 'color' },
            { name: '--btn-text-color', label: 'Text Color', type: 'color' },
            { name: '--btn-hover-bg-color', label: 'Hover Background', type: 'color' },
            { name: '--btn-border-radius', label: 'Border Radius', type: 'range', unit: 'rem', min: 0, max: 2, step: 0.125 },
            { name: '--btn-padding-y', label: 'Padding Y', type: 'range', unit: 'rem', min: 0, max: 2, step: 0.125 },
            { name: '--btn-padding-x', label: 'Padding X', type: 'range', unit: 'rem', min: 0, max: 3, step: 0.125 },
            { name: '--btn-font-size', label: 'Font Size', type: 'range', unit: 'rem', min: 0.5, max: 2, step: 0.1 },
            { name: '--btn-font-weight', label: 'Font Weight', type: 'range', min: 100, max: 900, step: 100 },
        ],
        text: [
            { selector: '.btn', label: 'Button Text' }
        ]
    },
    'dropdown': {
        selector: '.dropdown',
        css: [
            { name: '--dropdown-btn-bg', label: 'Button BG', type: 'color' },
            { name: '--dropdown-btn-text-color', label: 'Button Text Color', type: 'color' },
            { name: '--dropdown-menu-bg', label: 'Menu BG', type: 'color' },
            { name: '--dropdown-item-text-color', label: 'Item Text Color', type: 'color' },
            { name: '--dropdown-item-hover-bg', label: 'Item Hover BG', type: 'color' },
            { name: '--dropdown-border-radius', label: 'Border Radius', type: 'range', unit: 'rem', min: 0, max: 2, step: 0.1 },
            { name: '--dropdown-shadow', label: 'Shadow', type: 'text' },
        ],
        text: [
            { selector: '.dropdown-toggle', label: 'Button Text' },
            { selector: '.dropdown-menu a:nth-child(1)', label: 'Item 1' },
            { selector: '.dropdown-menu a:nth-child(2)', label: 'Item 2' },
            { selector: '.dropdown-menu a:nth-child(3)', label: 'Item 3' },
        ]
    },
    'tooltip': {
        selector: '.tooltip-container',
        css: [
            { name: '--tooltip-bg-color', label: 'Background Color', type: 'color' },
            { name: '--tooltip-text-color', label: 'Text Color', type: 'color' },
            { name: '--tooltip-border-radius', label: 'Border Radius', type: 'range', unit: 'rem', min: 0, max: 1, step: 0.1 },
            { name: '--tooltip-padding', label: 'Padding', type: 'range', unit: 'rem', min: 0.1, max: 1, step: 0.1 },
            { name: '--tooltip-font-size', label: 'Font Size', type: 'range', unit: 'rem', min: 0.5, max: 1.2, step: 0.05 },
        ],
        text: [
            { selector: '.tooltip-trigger', label: 'Trigger Text' },
            { selector: '.tooltip-content', label: 'Tooltip Text' },
        ]
    },
    'toast': {
        selector: '.toast',
        css: [
            { name: '--toast-bg-color', label: 'Background Color', type: 'color' },
            { name: '--toast-text-color', label: 'Text Color', type: 'color' },
            { name: '--toast-border-radius', label: 'Border Radius', type: 'range', unit: 'rem', min: 0, max: 2, step: 0.1 },
            { name: '--toast-shadow', label: 'Shadow', type: 'text'},
            { name: '--toast-icon-color', label: 'Icon Color', type: 'color' },
        ],
        text: [
            { selector: '.toast-title', label: 'Title Text' },
            { selector: '.toast-message', label: 'Message Text' },
        ]
    },
    'modal': {
        selector: '.modal-content',
        css: [
            { name: '--modal-bg-color', label: 'Background Color', type: 'color' },
            { name: '--modal-text-color', label: 'Text Color', type: 'color' },
            { name: '--modal-border-radius', label: 'Border Radius', type: 'range', unit: 'rem', min: 0, max: 2, step: 0.1 },
            { name: '--modal-max-width', label: 'Max Width', type: 'range', unit: 'rem', min: 20, max: 60, step: 1 },
            { name: '--modal-shadow', label: 'Shadow', type: 'text' },
            { name: '--modal-overlay-bg', label: 'Overlay BG Color', type: 'color' },
        ],
        text: [
            { selector: '.modal-title', label: 'Title Text' },
            { selector: '.modal-body p', label: 'Body Text' },
            { selector: '.modal-footer button:first-child', label: 'Close Button Text' },
            { selector: '.modal-footer button:last-child', label: 'Action Button Text' },
        ]
    },
    'accordion': {
        selector: '.accordion-container',
        css: [
            { name: '--accordion-border-color', label: 'Border Color', type: 'color' },
            { name: '--accordion-border-radius', label: 'Border Radius', type: 'range', unit: 'rem', min: 0, max: 2, step: 0.1 },
            { name: '--accordion-bg-color', label: 'Background Color', type: 'color' },
            { name: '--accordion-button-text-color', label: 'Header Text Color', type: 'color' },
            { name: '--accordion-button-hover-bg', label: 'Header Hover BG', type: 'color' },
            { name: '--accordion-content-bg', label: 'Content BG Color', type: 'color' },
            { name: '--accordion-content-text-color', label: 'Content Text Color', type: 'color' },
            { name: '--accordion-transition-duration', label: 'Animation Speed (ms)', type: 'range', unit: 'ms', min: 100, max: 1000, step: 50 },
        ],
        text: [
            { selector: '#accordion-header-1 .accordion-button', label: 'Header 1 Text' },
            { selector: '#accordion-panel-1 .accordion-content p', label: 'Content 1 Text' },
            { selector: '#accordion-header-2 .accordion-button', label: 'Header 2 Text' },
            { selector: '#accordion-panel-2 .accordion-content p', label: 'Content 2 Text' },
        ]
    },
    'tabs': {
        selector: '.tabs-container',
        css: [
            { name: '--tabs-border-color', label: 'Border Color', type: 'color' },
            { name: '--tab-text-color', label: 'Tab Text Color', type: 'color' },
            { name: '--tab-bg-color', label: 'Tab BG Color', type: 'color' },
            { name: '--tab-active-text-color', label: 'Active Tab Text', type: 'color' },
            { name: '--tab-active-border-color', label: 'Active Tab Border', type: 'color' },
            { name: '--tab-hover-bg-color', label: 'Tab Hover BG', type: 'color' },
            { name: '--tab-panel-padding', label: 'Panel Padding', type: 'range', unit: 'rem', min: 0, max: 3, step: 0.25 },
        ],
        text: [
            { selector: '.tab-button[aria-controls="panel-1"]', label: 'Tab 1 Text' },
            { selector: '.tab-button[aria-controls="panel-2"]', label: 'Tab 2 Text' },
            { selector: '.tab-button[aria-controls="panel-3"]', label: 'Tab 3 Text' },
            { selector: '#panel-1 p', label: 'Panel 1 Content' },
        ]
    },
    'breadcrumbs': {
        selector: '.breadcrumbs',
        css: [
            { name: '--breadcrumb-link-color', label: 'Link Color', type: 'color' },
            { name: '--breadcrumb-link-hover-color', label: 'Link Hover Color', type: 'color' },
            { name: '--breadcrumb-current-color', label: 'Current Page Color', type: 'color' },
            { name: '--breadcrumb-separator-color', label: 'Separator Color', type: 'color' },
            { name: '--breadcrumb-font-size', label: 'Font Size', type: 'range', unit: 'rem', min: 0.75, max: 1.5, step: 0.1 },
        ],
        text: [
            { selector: '.breadcrumbs li:nth-child(1) a', label: 'Link 1 Text' },
            { selector: '.breadcrumbs li:nth-child(2) a', label: 'Link 2 Text' },
            { selector: '.breadcrumbs li:nth-child(3)', label: 'Current Page Text' },
        ]
    },
    'card': {
        selector: '.card',
        css: [
            { name: '--card-bg-color', label: 'Background Color', type: 'color' },
            { name: '--card-border-radius', label: 'Border Radius', type: 'range', unit: 'rem', min: 0, max: 3, step: 0.1 },
            { name: '--card-shadow', label: 'Box Shadow', type: 'text' },
            { name: '--card-title-color', label: 'Title Color', type: 'color' },
            { name: '--card-text-color', label: 'Text Color', type: 'color' },
            { name: '--card-footer-bg', label: 'Footer BG Color', type: 'color' },
            { name: '--card-image-height', label: 'Image Height', type: 'range', unit: 'px', min: 100, max: 400, step: 10 },
        ],
        text: [
            { selector: '.card-title', label: 'Card Title' },
            { selector: '.card-text', label: 'Card Body Text' },
            { selector: '.card-footer button', label: 'Button Text' },
        ]
    },
    'badge': {
        selector: '.badge',
        css: [
            { name: '--badge-bg-color', label: 'Background Color', type: 'color' },
            { name: '--badge-text-color', label: 'Text Color', type: 'color' },
            { name: '--badge-border-radius', label: 'Border Radius', type: 'range', unit: 'rem', min: 0, max: 2, step: 0.1 },
            { name: '--badge-padding-y', label: 'Padding Y', type: 'range', unit: 'em', min: 0, max: 1, step: 0.1 },
            { name: '--badge-padding-x', label: 'Padding X', type: 'range', unit: 'em', min: 0, max: 1.5, step: 0.1 },
            { name: '--badge-dot-size', label: 'Dot Size', type: 'range', unit: 'rem', min: 0, max: 1, step: 0.1 },
            { name: '--badge-dot-color', label: 'Dot Color', type: 'color' },
        ],
        text: [
            { selector: '.badge-text', label: 'Badge Text' }
        ]
    },
    'avatar': {
        selector: '.avatar',
        css: [
            { name: '--avatar-size', label: 'Size', type: 'range', unit: 'rem', min: 2, max: 8, step: 0.25 },
            { name: '--avatar-border-radius', label: 'Border Radius', type: 'range', unit: '%', min: 0, max: 50, step: 1 },
            { name: '--status-size', label: 'Status Dot Size', type: 'range', unit: 'rem', min: 0.5, max: 1.5, step: 0.1 },
            { name: '--status-border-width', label: 'Status Border', type: 'range', unit: 'px', min: 0, max: 5, step: 1 },
            { name: '--status-online-color', label: 'Online Color', type: 'color' },
            { name: '--status-offline-color', label: 'Offline Color', type: 'color' },
        ],
        text: [
            { selector: '.avatar-initials', label: 'Initials Text' }
        ]
    },
    'progress-bar': {
        selector: '.progress-bar-container',
        css: [
            { name: '--progress-track-bg', label: 'Track Color', type: 'color' },
            { name: '--progress-bar-bg', label: 'Bar Color', type: 'color' },
            { name: '--progress-height', label: 'Height', type: 'range', unit: 'rem', min: 0.25, max: 2, step: 0.125 },
            { name: '--progress-border-radius', label: 'Border Radius', type: 'range', unit: 'rem', min: 0, max: 2, step: 0.1 },
        ],
        text: [
            { selector: '.progress-label', label: 'Label Text' }
        ]
    },
    'input': {
        selector: '.input-group',
        css: [
             { name: '--input-border-color', label: 'Border Color', type: 'color' },
             { name: '--input-border-radius', label: 'Border Radius', type: 'range', unit: 'rem', min: 0, max: 2, step: 0.1 },
             { name: '--input-bg-color', label: 'Background Color', type: 'color' },
             { name: '--input-text-color', label: 'Text Color', type: 'color' },
             { name: '--input-focus-ring-color', label: 'Focus Ring Color', type: 'color' },
             { name: '--input-placeholder-color', label: 'Placeholder Color', type: 'color' },
        ],
        text: [
            { selector: 'label[for="text-input"]', label: 'Text Input Label'},
        ]
    },
    'checkbox': {
        selector: '.custom-checkbox-container',
        css: [
            { name: '--checkbox-size', label: 'Size', type: 'range', unit: 'rem', min: 1, max: 3, step: 0.1 },
            { name: '--checkbox-border-color', label: 'Border Color', type: 'color' },
            { name: '--checkbox-checked-bg-color', label: 'Checked BG Color', type: 'color' },
            { name: '--checkbox-checked-border-color', label: 'Checked Border Color', type: 'color' },
            { name: '--checkbox-tick-color', label: 'Tick Color', type: 'color' },
        ],
        text: [
            { selector: 'label[for="custom-checkbox-1"]', label: 'Label 1 Text' },
            { selector: 'label[for="custom-checkbox-2"]', label: 'Label 2 Text' },
        ]
    },
    'toggle_switch': {
        selector: '.toggle-switch-container',
        css: [
            { name: '--toggle-width', label: 'Width', type: 'range', unit: 'rem', min: 2, max: 5, step: 0.25 },
            { name: '--toggle-bg-on', label: 'BG On Color', type: 'color' },
            { name: '--toggle-bg-off', label: 'BG Off Color', type: 'color' },
            { name: '--toggle-knob-color', label: 'Knob Color', type: 'color' },
        ],
        text: [
            { selector: '.toggle-label', label: 'Label Text' }
        ]
    }
};
