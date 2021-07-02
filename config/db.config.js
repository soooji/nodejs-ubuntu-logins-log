"use strict";
const mysql = require("mysql");

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/main.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

//local mysql db connection
const dbConn = mysql.createConnection({
    host: process.env.IP,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: "taskaloo",
});
dbConn.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});
module.exports = dbConn;
