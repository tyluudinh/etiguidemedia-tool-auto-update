var request = require('request');
// var schedule = require('node-schedule');




let RequestValuepotion = {
  getData: function (url, cookie, callback) {
    var options = {
      method: 'GET',
      url: url,
      headers: {
        'Cookie': cookie,
        'Content-type': 'application/json'
      },
    };
    request(options, function (error, response) {
      if (error) return null;
  
      if (response.statusCode === 200){
        // console.log(`URL: ${url}, statusCode: ${response.statusCode}, response: ${(response.body)}`);
        callback(response.body);
      }
      return null;
    });
  }
};
module.exports = RequestValuepotion;
