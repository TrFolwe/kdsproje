const mysql = require('mysql2')
require('dotenv/config')
const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME, MYSQL_INSTANCE_NAME } = process.env;

const mysqlPool = mysql.createPool({
    host: MYSQL_INSTANCE_NAME,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB_NAME
})

mysqlPool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("MySQL Bağlantısı kuruldu");

    connection.query(`SELECT * FROM urun`, (err, result) => {
        if (err) throw err;
        console.log("Veriler: ", result);
        connection.destroy();
    })
})

module.exports = mysqlPool;