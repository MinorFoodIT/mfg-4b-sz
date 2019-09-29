var mysql      = require('mysql');
var logger = require('./config/winston')(__filename)
var baseconfig = require('./config/config')
/*
var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'admin',
    password : 'minor@1234',
    database : 'food_api'
});
connection.connect(function(err){
    if(err){ throw  err}
    logger.info('[mysql] Connected Success!');
});

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    logger.info('[mysql] The solution is: ', results[0].solution);
});

connection.end();

*/

var pool = mysql.createPool({
    connectionLimit : 80,
    acquireTimeout : 120000,
    conneectionTimeout : 120000,
    host     : process.env.DB_HOST, //baseconfig.mysql_host, //'172.17.0.1',
    port     : baseconfig.mysql_port,
    user     : baseconfig.mysql_user,
    password : baseconfig.mysql_password,
    database : baseconfig.mysql_database
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        console.log("start db connnection")
        callback(err, connection);
    });
};

module.exports = getConnection;