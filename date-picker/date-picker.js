import { makeDOMWithProperties } from '../utils/dom.js';

export const makeDatePicker = ($container) => {
  const dateBox = makeDOMWithProperties('input', {
    className: 'date-box',
    type: 'text',
    placeholder: 'Select date',
  });

  dateBox.setAttribute('readonly', true);
  $container.appendChild(dateBox);
};
