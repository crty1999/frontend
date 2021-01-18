'use strict';

/**
 * @typedef {Object} Friend
 * @property {string} name Имя
 * @property {'male' | 'female'} gender Пол
 * @property {boolean} best Лучший ли друг?
 * @property {string[]} friends Список имён друзей
 */
const simpleSort = (a, b) => a.name.localeCompare(b.name);

function listOfInvited(friends, filter, maxLevel = Infinity) {
  let lvlList = friends.filter(friend => friend.best).sort(simpleSort);
  let currentLvl = 1;
  const invitedList = [];
  while (0 < lvlList.length && maxLevel >= currentLvl) {
    invitedList.push(...lvlList);
    lvlList = lvlList
      .reduce((object, friend) => object.concat(friend.friends), [])
      .map(friendName => friends.find(friend => friend.name === friendName))
      .filter((friend, index, self) => {
        return !invitedList.includes(friend) && self.indexOf(friend) === index;
      })
      .sort(simpleSort);
    currentLvl++;
  }

  return invitedList.filter(filter.whatGender);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 */
function Iterator(friends, filter) {
  if (!(filter instanceof Filter)) {
    throw new TypeError('filter is Filter, unou');
  }
  this.guests = listOfInvited(friends, filter);
}

Iterator.prototype.next = function() {
  return this.done() ? null : this.guests.shift();
};
Iterator.prototype.done = function() {
  return this.guests.length === 0;
};

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 * @param {Number} maxLevel Максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
  Iterator.call(this, friends, filter);
  this.guests = listOfInvited(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
  this.whatGender = () => true;
}

/**
 * Фильтр друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
  Filter.call(this);
  this.whatGender = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
  Filter.call(this);
  this.whatGender = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

module.exports = {
  Iterator,
  LimitedIterator,
  Filter,
  MaleFilter,
  FemaleFilter
};
