'use strict';

/**
 * Флаг решения дополнительной задачи
 * @see README.md
 */
const isExtraTaskSolved = true;

const minutesInDay = 1440;

const free = 0;
const busy = 1;

/**
 * @param {string} time  время в формате 'ПН 09:00+3' или '09:00+3'
 * @param {int} часовой пояс банка, -1 если считаем время дла банка
 * @returns {int} время в минутах
 */
function timeToMinutes(time, bankTimeZone = -1) {
  let minutesSinceMonday = 0;
  let zoneToMinutes = 0;
  let hoursToMinutes;
  // кол-во минут прошедших с начала понедельника 00:00, когда другой день недели начался
  const weekDayStart = {
    ПН: 0,
    ВТ: minutesInDay,
    СР: 2 * minutesInDay
  };

  if (bankTimeZone !== -1) {
    minutesSinceMonday = weekDayStart[time.split(' ')[0]];
    hoursToMinutes = parseInt(time.split(' ')[1].split(':')[0]) * 60;
    zoneToMinutes = (bankTimeZone - parseInt(time.split('+')[1])) * 60;
  } else {
    hoursToMinutes = parseInt(time.split(':')[0]) * 60;
  }
  const minutes = parseInt(time.split('+')[0].split(':')[1]);

  return minutesSinceMonday + hoursToMinutes + minutes + zoneToMinutes;
}

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  const bankTimeZone = parseInt(workingHours.from.split('+')[1]);
  const workingHoursOfBank = [];

  const scheduleFieldsArray = Object.entries(schedule);

  scheduleFieldsArray.forEach(keyValueArray => {
    const scheduleArray = keyValueArray[1];
    scheduleArray.forEach(elem => {
      if (typeof elem.from === 'string' && typeof elem.to === 'string') {
        elem.from = timeToMinutes(elem.from, bankTimeZone);
        elem.to = timeToMinutes(elem.to, bankTimeZone);
      }
    });
  });

  for (let i = 0; i < 3; i++) {
    workingHoursOfBank.push({
      from: timeToMinutes(workingHours.from) + i * minutesInDay,
      to: timeToMinutes(workingHours.to) + i * minutesInDay
    });
  }
  scheduleFieldsArray[scheduleFieldsArray.length] = ['Bank', workingHoursOfBank];

  const gangTimeLine = new Array(3 * minutesInDay).fill(0);
  const bankTimeLine = new Array(3 * minutesInDay).fill(0);

  scheduleFieldsArray.forEach(array => {
    let timeLine = gangTimeLine;
    if (array[0] === 'Bank') {
      timeLine = bankTimeLine;
    }
    for (let day = 0; day < array[1].length; day++) {
      timeLine[array[1][day].from]++;
      timeLine[array[1][day].to]--;
    }
  });

  for (let i = 1; i < gangTimeLine.length; i++) {
    gangTimeLine[i] = gangTimeLine[i - 1] + gangTimeLine[i];
    bankTimeLine[i] = bankTimeLine[i - 1] + bankTimeLine[i];
  }

  const resTimesAppropriate = [];
  let i = 0;
  let series = 0;

  while (i !== gangTimeLine.length - 1) {
    if (gangTimeLine[i] === free && bankTimeLine[i] === busy) {
      series++;
    } else {
      series = 0;
    }
    if (series === duration) {
      const robberyTime = i - duration + 1;
      resTimesAppropriate.push(robberyTime);
      i = robberyTime + 30;
      series = 0;
    } else {
      i++;
    }
  }

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists() {
      return resTimesAppropriate.length !== 0;
    },

    /**
     * Возвращает отформатированную строку с часами
     * для ограбления во временной зоне банка
     *
     * @param {string} template
     * @returns {string}
     *
     * @example
     * ```js
     * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
     * ```
     */
    format(template) {
      if (resTimesAppropriate.length === 0) {
        return '';
      }
      const remainderToDayOfWeek = {
        0: 'ПН',
        1: 'ВТ',
        2: 'СР'
      };
      const time = resTimesAppropriate[0];
      const dayOfWeek = remainderToDayOfWeek[Math.trunc(time / minutesInDay)];
      const hours = Math.trunc((time % minutesInDay) / 60);
      let minutes = (time % minutesInDay) % 60;
      if (minutes < 10) {
        minutes = '0' + minutes.toString();
      }

      return template
        .replace(/%HH/gi, hours)
        .replace(/%MM/gi, minutes)
        .replace(/%DD/gi, dayOfWeek);
    },

    /**
     * Попробовать найти часы для ограбления позже [*]
     * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
     * @returns {boolean}
     */
    tryLater() {
      if (resTimesAppropriate.length > 1) {
        resTimesAppropriate.shift();

        return true;
      }

      return false;
    }
  };
}

module.exports = {
  getAppropriateMoment,

  isExtraTaskSolved
};
