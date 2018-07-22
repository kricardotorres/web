var mysql = require('mysql');
port = process.env.PORT || 4205;
 
if (port === 4205) {
    var connection = mysql.createConnection({
        host: 'sql9.freemysqlhosting.net',
        port: 3306,
        user: 'sql9248685',
        password: 'Q1cGk1ULKJ',
        database: 'sql9248685',
        insecureAuth: true
    });
} else {console.log("No hay conexión");}
 
connection.connect();
 
module.exports = connection;