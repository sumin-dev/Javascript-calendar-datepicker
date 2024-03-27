import { makeDatePicker } from './date-picker/date-picker.js';
import {
  makeCalendar,
  generateDate,
  setYearAndMonth,
} from './calendar/calendar.js';

const today = new Date();
let month = today.getMonth();
let year = today.getFullYear();

const $containers = [...document.querySelectorAll('.date-picker')];
$containers.forEach(($container) => {
  makeDatePicker($container);
  makeCalendar($container);

  const dateBox = $container.querySelector('.date-box');
  const calendar = $container.querySelector('.calendar');

  dateBox.addEventListener('focus', () => {
    if (dateBox.value) {
      const selected = new Date(dateBox.value);
      month = selected.getMonth();
      year = selected.getFullYear();
    } else {
      month = today.getMonth();
      year = today.getFullYear();
    }

    setYearAndMonth(year, month, $container);
    generateDate(year, month, $container);

    calendar.style.display = 'block';
  });

  document.addEventListener('click', ({ target }) => {
    if (!dateBox.contains(target) && !calendar.contains(target)) {
      calendar.style.display = 'none';
    }
  });

  $container.addEventListener('calendar-date-select', (e) => {
    dateBox.value = e.detail;
  });

  const leftButton = $container.querySelector('i.bxs-left-arrow');
  leftButton.addEventListener('click', () => {
    month -= 1;
    if (month < 0) {
      year -= 1;
      month = 11;
    }

    setYearAndMonth(year, month, $container);
    generateDate(year, month, $container);
  });

  const rightButton = $container.querySelector('i.bxs-right-arrow');
  rightButton.addEventListener('click', () => {
    month += 1;
    if (month > 11) {
      year += 1;
      month = 0;
    }

    setYearAndMonth(year, month, $container);
    generateDate(year, month, $container);
  });
});

const datePicker = document.querySelector('.date-picker');

const updateFontSize = () => {
  const calendarSize =
    getComputedStyle(datePicker).getPropertyValue('--calendar-size');
  datePicker.querySelector('.calendar').style.fontSize =
    calendarSize.slice(0, -2) * 0.04 + 'px';
};

updateFontSize();
