const dayjs = require('dayjs');
const isYesterday = require('dayjs/plugin/isYesterday');
dayjs.extend(isYesterday);

/**
 * IMPORTANT: github api return UTC time, so we need to compare with UTC time.
 * 
 * @param {string} comparedDate 
 * @returns {boolean}
 */
const isLastDay = (comparedDate) => {
  console.log(comparedDate);
  return dayjs(comparedDate).isYesterday();
}

module.exports = isLastDay;
