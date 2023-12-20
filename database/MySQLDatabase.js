const mysql = require('mysql2')
require('dotenv/config')
const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME, MYSQL_INSTANCE_NAME, DEVELOPER_MODE, DEVELOPER_MYSQL_PASSWORD } = process.env;

const mysqlPool = mysql.createPool({
    host: MYSQL_INSTANCE_NAME,
    user: MYSQL_USER,
    password: DEVELOPER_MODE ? DEVELOPER_MYSQL_PASSWORD : MYSQL_PASSWORD,
    database: MYSQL_DB_NAME
})

mysqlPool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("MySQL Bağlantısı kuruldu");
    connection.destroy();
})

function getProductById(productId) {
    return new Promise((rs, rj) => {
        mysqlPool.getConnection((err, connection) => {
            if (err) return rj(err);
            connection.query(`SELECT * FROM urun WHERE urun_id = ?`, [productId], (err, value) => {
                if (err) return rj(err);
                rs(value[0]);
                connection.destroy();
            })
        })
    })
}

//Toprak yapısı id
function getSoilTypeById(soilTypeId) {
    return new Promise((rs, rj) => {
        mysqlPool.getConnection((err, connection) => {
            if (err) return rj(err);
            connection.query(`SELECT * FROM toprak_tip WHERE toprak_tip_id = ?`, [soilTypeId], (err, value) => {
                if (err) return rj(err);
                rs(value[0]);
                connection.destroy();
            })
        })
    })
}

module.exports = { getProductById, getSoilTypeById };
module.exports.database = mysqlPool;