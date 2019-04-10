const mysql = require('mysql2');
const { dbName, host, user, pw } = require('./config.json');

const con = mysql.createConnection({
    host,
    user,
    password: pw
});

con.connect(err => {
    if (err) throw err;
    con.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, err => {
        if (err) throw err;
        process.exit();
    })
});