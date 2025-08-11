export const propertyDefinitions = {
    'bg-color': { 
        type: 'color', 
        description: 'Sets the primary background color of the element.' 
    },
    'text-color': { 
        type: 'color', 
        description: 'Sets the color of the primary text.' 
    },
    'border-radius': { 
        type: 'range', 
        unit: 'rem', 
        min: 0, 
        max: 3, 
        step: 0.125,
        description: 'Controls the roundness of the corners.' 
    },
    'padding': { 
        type: 'text',
        unit: 'rem',
        description: 'Controls the inner spacing of the element.'
    },
    'font-size': {
        type: 'range',
        unit: 'rem',
        min: 0.5,
        max: 2.5,
        step: 0.1,
        description: 'Controls the size of the text.'
    },
    'width': {
        type: 'range',
        unit: 'px',
        min: 10,
        max: 500,
        step: 1,
        description: 'Controls the width of the element.'
    },
    'height': {
        type: 'range',
        unit: 'px',
        min: 10,
        max: 500,
        step: 1,
        description: 'Controls the height of the element.'
    },
    'opacity': {
        type: 'range',
        unit: '',
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Controls the transparency of the element.'
    },
    'color': {
        type: 'color',
        description: 'A generic color property, often for text or icons.'
    }
};
