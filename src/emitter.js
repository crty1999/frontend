'use strict';

/**
 * Сделано дополнительное задание: реализованы методы several и through.
 */
const isExtraTaskSolved = true;

/**
 * Получение нового Emitter'а
 * @returns {Object}
 */
function getEmitter() {
  /**
   * Хранилище событий:
   *
   * ['event': [
   *   {
   *     context: Object,
   *     settings: {
   *       handler: func() - обработчик
   *       times: [number or null] - лимит на количество вызовов, если есть
   *       frequency: [number or null] - частота вызова, если есть
   *       emitted: [number (0+)] - счетчик вызовов
   *     }
   *   },
   * ]]
   */
  const events = new Map();

  return {
    /**
     * Подписка на событие
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     */
    on: function(event, context, handler) {
      addEvent(events, event, context, handler, null, null);

      return this;
    },

    /**
     * Отписка от события
     * @param {string} event
     * @param {Object} context
     */
    off: function(event, context) {
      for (const currentEvent of events.keys()) {
        // Чекаем префиксы - 'slide' отпишет от 'slide.funny' в том числе
        if (currentEvent === event || currentEvent.startsWith(event + '.')) {
          const contexts = events.get(currentEvent);

          contexts.forEach(function(item, index, object) {
            if (item.context === context) {
              object.splice(index, 1);
            }
          });
        }
      }

      return this;
    },

    /**
     * Уведомление о событии
     * @param {string} event
     */
    emit: function(event) {
      const separateEvents = event.split('.').reverse();

      separateEvents.forEach((_, index) => {
        // Из переданного в функцию "slide.funny.monkey" получим:
        // 1. "slide.funny.monkey"
        // 2. "slide.funny"
        // 3. "slide"
        const currentEvent = separateEvents
          .slice(index, separateEvents.length)
          .reverse()
          .join('.');

        // Если не нашлось события, возвращаем объект, чтобы не прерывать цепочку вызовов
        if (!events.has(currentEvent)) {
          return this;
        }

        const contexts = events.get(currentEvent);

        contexts.forEach(value => {
          callHandler(events, value.settings, value.context);
          value.settings.emitted++;
        });
      });

      return this;
    },

    /**
     * Подписка на событие с ограничением по количеству отправляемых уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} times Сколько раз отправить уведомление
     */
    several: function(event, context, handler, times) {
      const timesChecked = times > 0 ? times : null;
      addEvent(events, event, context, handler, timesChecked, null);

      return this;
    },

    /**
     * Подписка на событие с ограничением по частоте отправки уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} frequency Как часто уведомлять
     */
    through: function(event, context, handler, frequency) {
      const frequencyChecked = frequency > 0 ? frequency : null;
      addEvent(events, event, context, handler, null, frequencyChecked);

      return this;
    }
  };
}

/**
 * Общий метод добавления события в events
 * для вызова в .on(), .several() и .through()
 *
 * @param {string} event
 * @param {Object} context
 * @param {Function} handler
 * @param {number} times
 * @param {number} frequency
 */
function addEvent(events, event, context, handler, times, frequency) {
  if (!events.has(event)) {
    events.set(event, []);
  }

  const contexts = events.get(event);

  contexts.push({
    context: context,
    settings: {
      handler: handler,
      times: times,
      frequency: frequency,
      emitted: 0
    }
  });
}

/**
 * Умный вызов обработчика для контроля times & frequincies
 *
 * @param {Object} settings
 * @param {Object} context
 */
function callHandler(events, settings, context) {
  // Не вызываем обработчик, если установлен лимит и уже превышен
  if (settings.times && settings.times <= settings.emitted) {
    return;
  }

  // Не вызываем обработчик, если не попадаем в установленную частоту
  if (settings.frequency && settings.emitted >= 1 && settings.emitted % settings.frequency !== 0) {
    return;
  }

  // Если дошли до сюда, значит все хорошо, можно вызывать
  settings.handler.call(context);
}

module.exports = {
  getEmitter,

  isExtraTaskSolved
};
