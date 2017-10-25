var BaseModel =  require('./BaseModel');
var utils = require('../libs/helper/utils');
let tableName = 'app';

let App = {
  findAll: function(callback) {
    BaseModel.query(`SELECT * FROM ${tableName} WHERE status = ${utils.getEnv('STATUS_ACTIVE')}`, function (err, rows) {
      return callback(err, rows);
    })
  },
  isAndroid: function (appType) {
    return utils.getEnv('PLATFORM_GOOGLE_PLAY') === appType;
  },
  isIOS: function (appType) {
    return utils.getEnv('PLATFORM_APPLE_APP_STORE') === appType;
  },
};

module.exports = App;
