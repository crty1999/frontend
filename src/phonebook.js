'use strict';

/**
 * Если вы решили сделать дополнительное задание и реализовали функцию importFromDsv,
 * то выставьте значение переменной isExtraTaskSolved в true.
 */
const isExtraTaskSolved = true;

/**
 * Телефонная книга
 */
const phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */

function CheckAndUpdate(phone, name, email) {
  if (!name || typeof name !== 'string' || !phone || !/^\d{10}$/i.test(phone)) {
    return false;
  }
  phoneBook[phone] = { name, email };

  return true;
}

function add(phone, name, email = '') {
  if (phone in phoneBook) {
    return false;
  }

  return CheckAndUpdate(phone, name, email);
}

/**
 * Обновление записи в телефонной книге
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function update(phone, name, email = '') {
  if (!(phone in phoneBook)) {
    return false;
  }

  return CheckAndUpdate(phone, name, email);
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {string} query
 * @returns {string[]}
 */
function getPhones(query) {
  const phones = {};

  if (!query || typeof query !== 'string') {
    return phones;
  }

  Object.entries(phoneBook).forEach(([key, value]) => {
    const { name, email } = value;

    if (
      query === '*' ||
      name.includes(query) ||
      (email && email.includes(query)) ||
      key.includes(query)
    ) {
      phones[key] = value;
    }
  });

  return phones;
}

function find(query) {
  const result = [];
  const phones = getPhones(query);
  if (phones === {}) {
    return result;
  }

  Object.entries(phones).forEach(([key, value]) => {
    const { name, email } = value;

    const phoneFormated = `+7 (${key.substr(0, 3)}) ${key.substr(3, 3)}-${key.substr(
      6,
      2
    )}-${key.substr(8, 2)}`;
    result.push(email ? `${name}, ${phoneFormated}, ${email}` : `${name}, ${phoneFormated}`);
  });

  return result.sort();
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {string} query
 * @returns {number}
 */
function findAndRemove(query) {
  let result = 0;
  const phones = getPhones(query);
  if (phones === {}) {
    return result;
  }

  Object.entries(phones).forEach(([key, value]) => {
    const { name, email } = value;
    if (key.includes(query) || name.includes(query) || (email && email.includes(query))) {
      delete phoneBook.key;
      result++;
    }
  });

  return result;
}

/**
 * Импорт записей из dsv-формата
 * @param {string} dsv
 * @returns {number} Количество добавленных и обновленных записей
 */
function importFromDsv(dsv) {
  let count = 0;

  if (!dsv || typeof dsv !== 'string') {
    return count;
  }

  const rows = dsv.split(/\r\n|\n|\r/);

  rows.forEach(row => {
    const [name, phone, email] = row.split(';');
    if (update(phone, name, email) || add(phone, name, email)) {
      count++;
    }
  });

  return count;
}

module.exports = {
  add,
  update,
  find,
  findAndRemove,
  importFromDsv,
  isExtraTaskSolved
};
