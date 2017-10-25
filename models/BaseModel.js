const utils = require('../libs/helper/utils');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : utils.getEnv('MYSQL_HOST'),
  port     : utils.getEnv('MYSQL_PORT'),
  user     : utils.getEnv('MYSQL_USERNAME'),
  password : utils.getEnv('MYSQL_PASSWORD'),
  database : utils.getEnv('MYSQL_DBNAME'),
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = connection;