import { appendChildrenList, makeDOMWithProperties } from '../utils/dom.js';
let clickConsoleEvent = null;
let clickBGColorEvent = null;
let selectedElement = null;
let selectedDate = null;
let selectedMonth = null;
let selectedYear = null;

export const makeCalendar = ($container) => {
  const calendar = makeDOMWithProperties('div', { className: 'calendar' });

  // calendar-nav area
  const monthContainer = makeDOMWithProperties('div', {
    className: 'month-container',
  });

  const leftArrow = makeDOMWithProperties('i', {
    className: 'bx bxs-left-arrow',
  });

  const monthArea = makeDOMWithProperties('div', { className: 'month-area' });
  const monthTitleEng = makeDOMWithProperties('p', {
    className: 'month-title-eng',
  });
  const monthTitleNum = makeDOMWithProperties('p', {
    className: 'month-title-num',
  });
  appendChildrenList(monthArea, [monthTitleEng, monthTitleNum]);

  const rightArrow = makeDOMWithProperties('i', {
    className: 'bx bxs-right-arrow',
  });

  appendChildrenList(monthContainer, [leftArrow, monthArea, rightArrow]);
  // calendar-nav area

  // calendar-grid area
  const daysContainer = makeDOMWithProperties('div', {
    className: 'days-container',
  });

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  weekdays.forEach((weekday) => {
    const day = makeDOMWithProperties('div', {
      className: 'day',
      innerHTML: weekday,
    });
    daysContainer.appendChild(day);
  });
  // calendar-grid area

  appendChildrenList(calendar, [monthContainer, daysContainer]);
  $container.appendChild(calendar);
};

export const generateDate = (year, month, $container) => {
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  if (selectedElement) {
    const selected = new Date(selectedElement);
    selectedDate = selected.getDate();
    selectedMonth = selected.getMonth();
    selectedYear = selected.getFullYear();
  }

  const curFirstDay = new Date(year, month, 1).getDay();
  const curLastDay = new Date(year, month + 1, 0).getDay();
  const curLastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();
  const prevFirstDate = prevLastDate - curFirstDay + 1;
  const nextLastDate = 7 - curLastDay - 1;

  const calendar = $container.querySelector('.days-container');

  while (calendar.children.length > 7) {
    calendar.removeChild(calendar.lastChild);
  }

  for (let i = prevFirstDate; i <= prevLastDate; i++) {
    const lastCell = makeDOMWithProperties('div', {
      className: 'date last-date',
      innerHTML: i,
    });

    let prevMonth = month - 1;
    let prevYear = year;

    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear -= 1;
    }

    if (
      prevYear === selectedYear &&
      prevMonth === selectedMonth &&
      i === selectedDate
    ) {
      lastCell.classList.add('selected');
    }

    calendar.appendChild(lastCell);
  }

  for (let i = 1; i <= curLastDate; i++) {
    const curCell = makeDOMWithProperties('div', {
      className: 'date cur-date',
      innerHTML: i,
    });

    const dayOfWeek = new Date(year, month, i).getDay();
    if (dayOfWeek === 0) curCell.classList.add('sun');
    if (dayOfWeek === 6) curCell.classList.add('sat');

    if (year === todayYear && month === todayMonth && i === todayDate) {
      curCell.classList.add('today');
    }

    if (
      year === selectedYear &&
      month === selectedMonth &&
      i === selectedDate
    ) {
      curCell.classList.add('selected');
    }

    calendar.appendChild(curCell);
  }

  for (let i = 1; i <= nextLastDate; i++) {
    const nextCell = makeDOMWithProperties('div', {
      className: 'date next-date',
      innerHTML: i,
    });

    let nextMonth = month + 1;
    let nextYear = year;

    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }

    if (
      nextYear === selectedYear &&
      nextMonth === selectedMonth &&
      i === selectedDate
    ) {
      nextCell.classList.add('selected');
    }

    calendar.appendChild(nextCell);
  }

  if (clickConsoleEvent) {
    calendar.removeEventListener('click', clickConsoleEvent);
  }

  clickConsoleEvent = consoleEventHandler(year, month, $container);
  calendar.addEventListener('click', clickConsoleEvent);

  if (clickBGColorEvent) {
    calendar.removeEventListener('click', clickBGColorEvent);
  }

  const dates = calendar.querySelectorAll('.date');
  clickBGColorEvent = bgcolorEventHandler(dates);
  calendar.addEventListener('click', clickBGColorEvent);
};

export const setYearAndMonth = (year, month, $container) => {
  const monthArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthTitleEng = $container.querySelector('p.month-title-eng');
  monthTitleEng.innerHTML = monthArr[month];

  const monthTitleNum = $container.querySelector('p.month-title-num');
  monthTitleNum.innerHTML = year;
};

const consoleEventHandler = (year, month, $container) => {
  return ({ target }) => {
    if (!target.matches('.date')) return;

    let clickedYear = year;
    let clickedMonth = month;
    const clickedDate = target.textContent;

    if (target.classList.contains('last-date')) {
      clickedYear = new Date(year, month - 1, clickedDate).getFullYear();
      clickedMonth = new Date(year, month - 1, clickedDate).getMonth();
    } else if (target.classList.contains('next-date')) {
      clickedYear = new Date(year, month + 1, clickedDate).getFullYear();
      clickedMonth = new Date(year, month + 1, clickedDate).getMonth();
    }

    let formattedMonth = String(clickedMonth + 1).padStart(2, '0');
    let formattedDate = String(clickedDate).padStart(2, '0');

    if (
      selectedElement === `${clickedYear}-${formattedMonth}-${formattedDate}`
    ) {
      console.log(
        `선택 해제한 날짜: ${clickedYear}-${formattedMonth}-${formattedDate}`
      );
      selectedElement = null;
      selectedYear = null;
      selectedMonth = null;
      selectedDate = null;
    } else {
      console.log(
        `선택한 날짜: ${clickedYear}-${formattedMonth}-${formattedDate}`
      );
      selectedElement = `${clickedYear}-${formattedMonth}-${formattedDate}`;
    }

    $container.dispatchEvent(
      new CustomEvent('calendar-date-select', {
        detail: selectedElement
          ? `${clickedYear}-${formattedMonth}-${formattedDate}`
          : null,
      })
    );
  };
};

const bgcolorEventHandler = (dates) => {
  return ({ target }) => {
    if (!target.matches('.date')) return;

    if (target.classList.contains('selected')) {
      target.classList.remove('selected');
    } else {
      dates.forEach((date) => {
        date.classList.remove('selected');
      });
      target.classList.add('selected');
    }
  };
};
