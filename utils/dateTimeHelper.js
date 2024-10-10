// utils/dateTimeHelper.js

/**
 * Converts a JavaScript date object or an ISO string to MySQL DATETIME format.
 * @param {string | Date} date - The date string or JavaScript Date object.
 * @returns {string} - Formatted date in 'YYYY-MM-DD HH:MM:SS' format.
 */
const formatDateForMySQL = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
  module.exports = {
    formatDateForMySQL,
  };
  