var mysql      = require('mysql');
//var baseconfig = require('./config/config')

var pool = mysql.createPool({
    connectionLimit : 10,
    acquireTimeout : 120000,
    conneectionTimeout : 120000,
    host     : '127.0.0.1', //'172.17.0.1',
    port     : 3306,
    user     : 'admin',
    password : 'minor@1234',
    database : 'storeasservice'
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports = getConnection;