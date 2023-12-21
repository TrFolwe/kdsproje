const { error } = require('console');
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

const wait = ms => new Promise(rs => setTimeout(rs, ms))

function getGraphicsBoxDataAll() {
    const sqlJson = {
        tarla_sayisi: `SELECT COUNT(tarla.tarla_id) AS 'tarla_sayisi' FROM tarla`,
        urun_sayisi: `SELECT COUNT(urun.urun_id) AS 'urun_sayisi' FROM urun`,
        bugday_uretim_miktari: `SELECT (SUM(uretim_miktari.mayis)+SUM(uretim_miktari.haziran)+SUM(uretim_miktari.temmuz)+
            SUM(uretim_miktari.agustos)+SUM(uretim_miktari.eylul)+SUM(uretim_miktari.ekim)) AS 'bugday_uretim_miktari'
            FROM uretim_miktari
            WHERE uretim_miktari.urun_id=1;`,
        arpa_uretim_miktari: `SELECT (SUM(uretim_miktari.mayis)+SUM(uretim_miktari.haziran)+SUM(uretim_miktari.temmuz)+
            SUM(uretim_miktari.agustos)+SUM(uretim_miktari.eylul)+SUM(uretim_miktari.ekim)) AS 'arpa_uretim_miktari'
            FROM uretim_miktari
            WHERE uretim_miktari.urun_id=2;`,
        domates_uretim_miktari: `SELECT (SUM(uretim_miktari.mayis)+SUM(uretim_miktari.haziran)+SUM(uretim_miktari.temmuz)+
            SUM(uretim_miktari.agustos)+SUM(uretim_miktari.eylul)+SUM(uretim_miktari.ekim)) AS 'domates_uretim_miktari'
            FROM uretim_miktari
            WHERE uretim_miktari.urun_id=3;`
    }

    const dataJson = {};

    return new Promise(async (rs, rj) => {
        mysqlPool.getConnection((err, connection) => {
            if (err) return rj(err);
            Object.keys(sqlJson).forEach(key => {
                connection.query(sqlJson[key], (err, result) => {
                    dataJson[key] = result[0][key];
                })
            })
            connection.release();
        })
        await wait(300);
        rs(dataJson);
    })
}

module.exports = { getProductById, getSoilTypeById, getGraphicsBoxDataAll };
module.exports.database = mysqlPool;