require('dotenv').config();

var Sys = require('./models/SystemSetting');
var App = require('./models/App');
var utils = require('./libs/helper/utils');



var moment = require('moment');
var schedule = require('node-schedule');

//Model

var AdRevenue = require('./models/AdRevenue');
var Ecpm = require('./models/Ecpm');
var AdImpressionsAdClicks = require('./models/AdImpressionsAdClicks');
var AdFillRate = require('./models/AdFillRate');


var day = (moment().subtract(2, 'days').format('YYYYMMDD'));

var Cookie = {
  android: null,
  ios: null
};
var ratio = null;

Sys.findByKey(utils.getEnv('KEY_COOKIE_ANDROID'), function (err, res) {
  if (err) throw err;
  Cookie.android = (res[0].value);
});


Sys.findByKey(utils.getEnv('KEY_COOKIE_IOS'), function (err, res) {
  if (err) throw err;
  Cookie.ios = (res[0].value);
});



var rule = new schedule.RecurrenceRule();
rule.hour = utils.getEnv('SCHEDULE_HOUR');
rule.minute = utils.getEnv('SCHEDULE_MINUTE');

var j = schedule.scheduleJob(rule, function(){
  console.log(`<<<<<<<<<<<<<< Start Job at ${moment().format('YYYY-MM-DD HH:MM:ss')} >>>>>>>>>>>>>>>>>>>>>`);
  initJob();
});

function initJob() {
  
  Sys.findByKey(utils.getEnv('KEY_RATIO'), function (err, res) {
    if (err) throw err;
    ratio = (res[0].value);
    getData(Cookie, ratio);
  });
}

function getData(Cookie, ratio) {
  App.findAll(function (err, res) {
    if (err) throw err;
    res.map((app, k) => {
      var cookie = App.isIOS(app.platform) ? Cookie.ios : Cookie.android;
      if (app.app_valuepotion_id !== null){
        for (var i = 1; i < 1 + utils.getEnv('SUB_DAY', 1); i++){
          day = utils.subDate(i);
          AdRevenue.service(app, day, day, cookie, ratio, function (error, results) {
            if (error) throw error;
            console.log(`AppID: ${app.id} - 1 record was inserted in table '${AdRevenue.tableName}' with id = ${(results.insertId)}`)
          });
  
          Ecpm.service(app, day, day, cookie, ratio, function (error, results) {
            if (error) throw error;
            console.log(`AppID: ${app.id} - 1 record was inserted in table '${Ecpm.tableName}' with id = ${(results.insertId)}`)
          });
  
          AdImpressionsAdClicks.service(app, day, day, cookie, ratio, function (error, results) {
            if (error) throw error;
            console.log(`AppID: ${app.id} - 1 record was inserted in table '${AdImpressionsAdClicks.tableName}' with id = ${(results.insertId)}`)
          });
          
          AdFillRate.service(app, day, day, cookie, ratio, function (error, results) {
            if (error) throw error;
            console.log(`AppID: ${app.id} - 1 record was inserted in table '${AdFillRate.tableName}' with id = ${(results.insertId)}`)
          })
        }
        
      }
    })
  })
}
