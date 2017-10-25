var BaseModel =  require('./BaseModel');
var utils = require('../libs/helper/utils');
let tableName = 'system_setting';

let SystemSetting = {
  findByKey: function(key, callback) {
    BaseModel.query(`SELECT value FROM ${tableName} WHERE ${tableName}.key = ?`, [key] , function (err, rows) {
      if (err) throw err;
      callback(err, rows);
    })
  }
};

module.exports = SystemSetting;
