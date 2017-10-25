const config = require('../../config.json');

var moment = require('moment');

module.exports = {
  /**
   * Get environment variable by key
   *
   * @param {String} key
   * @param {String} [defaultValue='']
   * @return {String}
   */
  getEnv(key, defaultValue = '') {
    if (!key) {
      throw new Error('Key is required');
    }

    return process.env[key] || defaultValue;
  },

  /**
   * Get current NODE_ENV
   *
   * @return {String}
   */
  env() {
    return this.getEnv('NODE_ENV', 'development');
  },

  /**
   * Check to see swagger doc enabled or not
   *
   * @return boolean
   */
  isSwaggerDocEnabled() {
    return this.getEnv('SWAGGER_DOC') === 'enabled';
  },

  /**
   * Validate line is empty or not
   *
   * @param {String} line
   * @return boolean
   */
  isEmptyLine(line) {
    return /^$/.test(line);
  },

  getConfig() {
    return config;
  },
  

  getIpAddress(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  },

  generateResetToken() {
    return Math.floor(100000 + (Math.random() * 900000));
  },

  /**
   * Check if a method is in a specified list
   * @param method
   * @param arrMethod
   * @returns {boolean}
   */
  isValidMethod(method, arrMethod = ['email']) {
    return arrMethod.indexOf(method) >= 0;
  },
  
  formatNumber(value, round = 2) {
    var div = round * Math.pow(10, round - 1);
    return Math.floor(parseFloat(value) * (div)) / div;
  },
  
  formatDigitNumber(num, round = 2) {
    num = this.formatNumber(num, round);
    return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  
  subDate(subDay = 1, format = 'YYYYMMDD', time = null){
    if (time === null){
      return moment().subtract(subDay, 'days').format(format)
    }
    return moment(''+time+'').subtract(subDay, 'days').format(format);
  },
  
  addDate(addDay = 1, format = 'YYYYMMDD', time = null){
    if (time === null){
      return moment().add(addDay, 'days').format(format)
    }
    return moment(''+time+'').add(addDay, 'days').format(format);
  },
};
