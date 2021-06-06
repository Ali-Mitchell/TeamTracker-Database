const mysql = require('mysql2');
const util = require('util');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Admin1',
        database: 'tracker'
    },
    console.log('Connected to database')
);

db.connect(function(err){
    if (err) throw err;
});

// What is this doing?
db.connect = util.promisify(db.connect);

module.exports = db;