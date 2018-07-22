var mysql = require('mysql');
port = process.env.PORT || 4205;
 
if (port === 4205) {
    var connection = mysql.createConnection({
        host: 'sql2.freesqldatabase.com',
        port: 3306,
        user: 'sql2248746',
        password: 'bL9!yL3!',
        database: 'sql2248746',
        insecureAuth: true
    });
} else {console.log("No hay conexión");}
 
connection.connect();
 
module.exports = connection;