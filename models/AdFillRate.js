var BaseModel =  require('./BaseModel');
var utils = require('../libs/helper/utils');
var RequestData = require('../service/RequestValuepotion');
var moment = require('moment');
let tableName = 'ad_fill_rate';

let AdFillRate = {
  tableName: tableName,
  findOne: function(appId, date, callback) {
    BaseModel.query(`SELECT * FROM ${tableName} WHERE app_id = ${appId} AND date('${date}') = date`, function (err, rows) {
      return callback(err, rows);
    })
  },
  insert: function (data, callback) {
    BaseModel.query(`INSERT INTO ${tableName} SET ?`, data, function (err, rows) {
      return callback(err, rows);
    })
  },
  update: function (id, data, callback) {
    BaseModel.query(`UPDATE ${tableName} SET ? where id = ${id}`, data, function (err, rows) {
      return callback(err, rows);
    })
  },
  service: function (app, startDate,  endDate, cookie, ratio, callback) {
    RequestData.getData(this.url_request(app.app_valuepotion_id, startDate, endDate), cookie, function (res) {
      var data = JSON.parse(res), date = moment(''+startDate+'').format('YYYY-MM-DD');
      
      var model = AdFillRate.newModel(app.id, date);
      var series = data.series;
      if (series.length > 1){
        series.map((serie) => {
          var v = parseInt(serie.data[0] * ratio).toFixed(3);
          if (serie.name === 'AdRequests'){
            model.ad_requests = v;
          }
          if (serie.name === 'AdResponses') {
            model.ad_responses = v;
          }
          if (model.ad_requests !== 0){
            model.fill_rate = parseFloat((model.ad_responses / model.ad_requests) * 100).toFixed(2);
          }
        })
      }
      AdFillRate.findOne(app.id, date, function (err, rows) {
        if (rows.length === 0){
          AdFillRate.insert(model, function (err, rows) {
            callback(err, rows);
          })
        }
      })
    })
  },
  newModel: (appId, date) => {
    return {
      app_id: appId,
      date: date,
      ad_requests: 0,
      ad_responses: 0,
      fill_rate: 0,
    };
  },
  /**
   *
   * @param appId
   * @param startDate: 20171023
   * @param endDate: 20171023
   * @returns {string}
   */
  url_request: (appId, startDate, endDate) => {
    return `${utils.getEnv('URL_CHART') + appId}/summary_fillrate.chart?start_date=${startDate}&end_date=${endDate}&type=standard&collection_id=${appId}`
  }
};

module.exports = AdFillRate;
