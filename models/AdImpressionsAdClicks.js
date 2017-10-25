var BaseModel =  require('./BaseModel');
var utils = require('../libs/helper/utils');
var RequestData = require('../service/RequestValuepotion');
var moment = require('moment');
let tableName = 'ad_impressions_ad_clicks';

let AdImpressionsAdClicks = {
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
      
      var model = AdImpressionsAdClicks.newModel(app.id, date);
      var series = data.series;
      if (series.length > 1){
        series.map((serie) => {
          var v = parseFloat(serie.data[0] * ratio).toFixed(3);
          if (serie.name === 'ADImpressions'){
            model.ad_impressions = v;
          }
          if (serie.name === 'ADClicks') {
            model.ad_clicks = v;
          }
        })
      }
      AdImpressionsAdClicks.findOne(app.id, date, function (err, rows) {
        if (rows.length === 0){
          AdImpressionsAdClicks.insert(model, function (err, rows) {
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
      ad_impressions: 0,
      ad_clicks: 0,
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
    return `${utils.getEnv('URL_CHART') + appId}/summary_ad_impressions_ad_clicks.chart?start_date=${startDate}&end_date=${endDate}&type=standard&collection_id=${appId}`
  }
};

module.exports = AdImpressionsAdClicks;
