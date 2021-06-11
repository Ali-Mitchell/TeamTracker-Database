const mysql = require('mysql2');
// util formats a string
const util = require('util');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    },
    console.log('Connected to database')
);

db.connect(function(err){
    if (err) throw err;
});

// What is this doing?
db.connect = util.promisify(db.connect);

module.exports = db;