var BaseModel =  require('./BaseModel');
var utils = require('../libs/helper/utils');
var RequestData = require('../service/RequestValuepotion');
var moment = require('moment');
let tableName = 'ad_revenue';

let AdRevenue = {
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
      
      var model = AdRevenue.newModel(app.id, date);
      var series = data.series;
      if (series.length > 1){
        series.map((serie) => {
          var v = parseFloat(serie.data[0] * ratio).toFixed(3);
          if (serie.name === 'Text'){
            model.text = v;
          }
          if (serie.name === 'Image'){
            model.image = v;
          }
          if (serie.name === 'Video'){
            model.video = v;
          }
          if (serie.name === 'Animatedimage'){
            model.animated_image = v;
          }
          if (serie.name === 'Richmedia'){
            model.rich_media = v;
          }
        })
      }
      AdRevenue.findOne(app.id, date, function (err, rows) {
        if (rows.length === 0){
          AdRevenue.insert(model, function (err, rows) {
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
      video: 0,
      animated_image: 0,
      rich_media: 0,
      text: 0,
      image: 0
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
    return `${utils.getEnv('URL_CHART') + appId}/summary_ad_revenue.chart?start_date=${startDate}&end_date=${endDate}&type=standard&collection_id=${appId}`
  }
};

module.exports = AdRevenue;
