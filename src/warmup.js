'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError('TypeError exception');
  }

  return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
  if (typeof year !== 'number') {
    throw new TypeError('TypeError exception');
  }
  if (year < 0 || !Number.isInteger(year)) {
    throw new RangeError('RangeError exception');
  }

  return Math.ceil(year / 100);
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
  if (typeof hexColor !== 'string') {
    throw new TypeError('TypeError exception');
  }

  let result;

  if (hexColor.length === 7) {
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  } else {
    if (hexColor.length === 4) {
      result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hexColor);

      if (!result) {
        throw new RangeError('RangeError exception');
      }

      result[1] = result[1] + result[1];
      result[2] = result[2] + result[2];
      result[3] = result[3] + result[3];
    } else {
      throw new RangeError('RangeError exception');
    }
  }

  const red = parseInt(result[1], 16);
  const green = parseInt(result[2], 16);
  const blue = parseInt(result[3], 16);

  if (red > 255 || red < 0 || green > 255 || green < 0 || blue < 0 || blue > 255) {
    throw new RangeError('RangeError exception');
  }

  return `(${red}, ${green}, ${blue})`;
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
  if (typeof n !== 'number') {
    throw new TypeError('TypeError exception');
  }

  if (n < 1 || !Number.isInteger(n)) {
    throw new RangeError('RangeError exception');
  }

  let n0 = 0;
  let n1 = 1;
  let res = 1;
  for (let i = 1; i < n; i++) {
    res = n0 + n1;
    n0 = n1;
    n1 = res;
  }

  return res;
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new TypeError('TypeError exception');
  }
  for (const a of matrix) {
    if (!Array.isArray(a) || matrix[0].length !== a.length) {
      throw new TypeError('TypeError exception');
    }
  }
  if (matrix[0].length === 0) {
    return matrix;
  }

  const transpose = tempMatrix => tempMatrix[0].map((col, i) => tempMatrix.map(row => row[i]));

  return transpose(matrix);
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
  if (!Number.isInteger(n) || !Number.isInteger(targetNs) || n === Infinity) {
    throw new TypeError('TypeError exception');
  }
  if (2 > targetNs || targetNs > 36) {
    throw new RangeError('RangeError exception');
  }

  return n.toString(targetNs);
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
  if (typeof phoneNumber !== 'string') {
    throw new TypeError('TypeError exception');
  }
  const pattern = /^8-800-[0-9]{3}-[0-9]{2}-[0-9]{2}$/;

  return pattern.test(phoneNumber);
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
  if (typeof text !== 'string') {
    throw new TypeError('TypeError exception');
  }
  const a = (text.match(new RegExp('\\(-:', 'g')) || []).length;
  const b = (text.match(new RegExp(':-\\)', 'g')) || []).length;

  return a + b;
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
  const SIZE = 3;

  function isWinLine(x, y, dx, dy, obj) {
    for (let i = 0; i < SIZE; ++i) {
      if (obj !== field[x + i * dx][y + i * dy]) {
        return false;
      }
    }

    return true;
  }

  for (const elem of ['x', 'o']) {
    for (let i = 0; i < SIZE; i++) {
      if (isWinLine(0, i, 1, 0, elem) || isWinLine(i, 0, 0, 1, elem)) {
        return elem;
      }
    }
    if (isWinLine(0, 0, 1, 1, elem) || isWinLine(0, 2, 1, -1, elem)) {
      return elem;
    }
  }

  return 'draw';
}

module.exports = {
  abProblem,
  centuryByYearProblem,
  colorsProblem,
  fibonacciProblem,
  matrixProblem,
  numberSystemProblem,
  phoneProblem,
  smilesProblem,
  ticTacToeProblem
};
