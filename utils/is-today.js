const dayjs = require('dayjs');
const isToday = require('dayjs/plugin/isToday')
dayjs.extend(isToday);

/**
 * IMPORTANT: github api return UTC time, so we need to compare with UTC time.
 * 
 * @param {string} comparedDate 
 * @returns {boolean}
 */
const isTodayOrNot = (comparedDate) => {
  return dayjs(comparedDate).isToday();
}

module.exports = isTodayOrNot;
