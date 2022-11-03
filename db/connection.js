const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker_DB',
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connection successful');
});

module.exports = connection;