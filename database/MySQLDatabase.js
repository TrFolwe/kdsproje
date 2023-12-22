const { error } = require('console');
const mysql = require('mysql2')
require('dotenv/config')
const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME, MYSQL_INSTANCE_NAME, DEVELOPER_MODE, DEVELOPER_MYSQL_PASSWORD } = process.env;

const mysqlOptions = {
    host: MYSQL_INSTANCE_NAME,
    user: MYSQL_USER,
    database: MYSQL_DB_NAME
}

if (DEVELOPER_MODE) mysqlOptions["password"] = DEVELOPER_MYSQL_PASSWORD;

const mysqlPool = mysql.createPool(mysqlOptions);

mysqlPool.getConnection(async err => {
    if (err) throw err;
    console.log("MySQL Bağlantısı kuruldu");
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
                    dataJson[key] = result[0][key]
                })
            });
        })

        await wait(300);
        rs(dataJson);
    })
}

function getGraphicsChartsDataAll() {
    const dataJson = {};
    const sqlJson = {
        urun_tarla_sayilari: `
        SELECT (SELECT COUNT(tarla.tarla_id) FROM tarla WHERE tarla.urun_id=1)AS bugday_tarla_sayisi,
        (SELECT COUNT(tarla.tarla_id) FROM tarla WHERE tarla.urun_id=2)AS arpa_tarla_sayisi,
        (SELECT COUNT(tarla.tarla_id) FROM tarla WHERE tarla.urun_id=3)AS domates_tarla_sayisi,
        (SELECT COUNT(tarla.tarla_id) FROM tarla WHERE tarla.urun_id IS NULL)AS domates_tarla_sayisi,
        (SELECT COUNT(tarla.tarla_id) AS bos_tarla_sayisi FROM tarla WHERE tarla.urun_id IS NULL)AS bos_tarla_sayisi`,
        en_yuksek_bugday_uretimi_ay: `SELECT
        (SELECT MAX(uretim_miktari.mayis) FROM uretim_miktari WHERE uretim_miktari.urun_id=1) AS 'mayis',
        (SELECT MAX(uretim_miktari.haziran) FROM uretim_miktari WHERE uretim_miktari.urun_id=1) AS 'haziran',
        (SELECT MAX(uretim_miktari.temmuz) FROM uretim_miktari WHERE uretim_miktari.urun_id=1) AS 'temmuz',
        (SELECT MAX(uretim_miktari.agustos) FROM uretim_miktari WHERE uretim_miktari.urun_id=1) AS 'agustos',
        (SELECT MAX(uretim_miktari.eylul) FROM uretim_miktari WHERE uretim_miktari.urun_id=1) AS 'eylul',
        (SELECT MAX(uretim_miktari.ekim) FROM uretim_miktari WHERE uretim_miktari.urun_id=1) AS 'ekim'`,
        en_yuksek_arpa_uretimi_ay: `SELECT
        (SELECT MAX(uretim_miktari.mayis) FROM uretim_miktari WHERE uretim_miktari.urun_id=2) AS 'mayis',
        (SELECT MAX(uretim_miktari.haziran) FROM uretim_miktari WHERE uretim_miktari.urun_id=2) AS 'haziran',
        (SELECT MAX(uretim_miktari.temmuz) FROM uretim_miktari WHERE uretim_miktari.urun_id=2) AS 'temmuz',
        (SELECT MAX(uretim_miktari.agustos) FROM uretim_miktari WHERE uretim_miktari.urun_id=2) AS 'agustos',
        (SELECT MAX(uretim_miktari.eylul) FROM uretim_miktari WHERE uretim_miktari.urun_id=2) AS 'eylul',
        (SELECT MAX(uretim_miktari.ekim) FROM uretim_miktari WHERE uretim_miktari.urun_id=2) AS 'ekim'
        `,
        en_yuksek_domates_uretimi_ay: `SELECT
        (SELECT MAX(uretim_miktari.mayis) FROM uretim_miktari WHERE uretim_miktari.urun_id=3) AS 'mayis',
        (SELECT MAX(uretim_miktari.haziran) FROM uretim_miktari WHERE uretim_miktari.urun_id=3) AS 'haziran',
        (SELECT MAX(uretim_miktari.temmuz) FROM uretim_miktari WHERE uretim_miktari.urun_id=3) AS 'temmuz',
        (SELECT MAX(uretim_miktari.agustos) FROM uretim_miktari WHERE uretim_miktari.urun_id=3) AS 'agustos',
        (SELECT MAX(uretim_miktari.eylul) FROM uretim_miktari WHERE uretim_miktari.urun_id=3) AS 'eylul',
        (SELECT MAX(uretim_miktari.ekim) FROM uretim_miktari WHERE uretim_miktari.urun_id=3) AS 'ekim'`,
        bugday_satis_oran: `SELECT (SELECT ROUND((((SELECT satis_miktari.mayis FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021)
        -
       (SELECT satis_miktari.mayis FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2017))
       /
       (SELECT satis_miktari.mayis FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'mayis',
       
       
(SELECT ROUND((((SELECT satis_miktari.haziran FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021)
        -
       (SELECT satis_miktari.haziran FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2017))
       /
       (SELECT satis_miktari.haziran FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'haziran',


(SELECT ROUND((((SELECT satis_miktari.temmuz FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021)
        -
       (SELECT satis_miktari.temmuz FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2017))
       /
       (SELECT satis_miktari.temmuz FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'temmuz',
       

(SELECT ROUND((((SELECT satis_miktari.agustos FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021)
        -
       (SELECT satis_miktari.agustos FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2017))
       /
       (SELECT satis_miktari.agustos FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'agustos',
       
       
       
(SELECT ROUND((((SELECT satis_miktari.eylul FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021)
        -
       (SELECT satis_miktari.eylul FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2017))
       /
       (SELECT satis_miktari.eylul FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'eylul',
       

(SELECT ROUND((((SELECT satis_miktari.ekim FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021)
        -
       (SELECT satis_miktari.ekim FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2017))
       /
       (SELECT satis_miktari.ekim FROM satis_miktari WHERE satis_miktari.urun_id=1 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'ekim'`,
        arpa_satis_oran: `SELECT (SELECT ROUND((((SELECT satis_miktari.mayis FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021)
       -
      (SELECT satis_miktari.mayis FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2017))
      /
      (SELECT satis_miktari.mayis FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'mayis',
      
      
(SELECT ROUND((((SELECT satis_miktari.haziran FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021)
       -
      (SELECT satis_miktari.haziran FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2017))
      /
      (SELECT satis_miktari.haziran FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'haziran',


(SELECT ROUND((((SELECT satis_miktari.temmuz FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021)
       -
      (SELECT satis_miktari.temmuz FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2017))
      /
      (SELECT satis_miktari.temmuz FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'temmuz',
      

(SELECT ROUND((((SELECT satis_miktari.agustos FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021)
       -
      (SELECT satis_miktari.agustos FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2017))
      /
      (SELECT satis_miktari.agustos FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'agustos',
      
      
      
(SELECT ROUND((((SELECT satis_miktari.eylul FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021)
       -
      (SELECT satis_miktari.eylul FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2017))
      /
      (SELECT satis_miktari.eylul FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'eylul',
      

(SELECT ROUND((((SELECT satis_miktari.ekim FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021)
       -
      (SELECT satis_miktari.ekim FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2017))
      /
      (SELECT satis_miktari.ekim FROM satis_miktari WHERE satis_miktari.urun_id=2 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'ekim'`,
      domates_satis_oran: `SELECT (SELECT ROUND((((SELECT satis_miktari.mayis FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021)
      -
     (SELECT satis_miktari.mayis FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2017))
     /
     (SELECT satis_miktari.mayis FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'mayis',
     
     
(SELECT ROUND((((SELECT satis_miktari.haziran FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021)
      -
     (SELECT satis_miktari.haziran FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2017))
     /
     (SELECT satis_miktari.haziran FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'haziran',


(SELECT ROUND((((SELECT satis_miktari.temmuz FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021)
      -
     (SELECT satis_miktari.temmuz FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2017))
     /
     (SELECT satis_miktari.temmuz FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'temmuz',
     

(SELECT ROUND((((SELECT satis_miktari.agustos FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021)
      -
     (SELECT satis_miktari.agustos FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2017))
     /
     (SELECT satis_miktari.agustos FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'agustos',
     
     
     
(SELECT ROUND((((SELECT satis_miktari.eylul FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021)
      -
     (SELECT satis_miktari.eylul FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2017))
     /
     (SELECT satis_miktari.eylul FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'eylul',
     

(SELECT ROUND((((SELECT satis_miktari.ekim FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021)
      -
     (SELECT satis_miktari.ekim FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2017))
     /
     (SELECT satis_miktari.ekim FROM satis_miktari WHERE satis_miktari.urun_id=3 AND satis_miktari.yillar=2021))*100)AS sonuc)AS 'ekim'`
    };

    return new Promise(async (rs, rj) => {
        mysqlPool.getConnection((err, connection) => {
            Object.keys(sqlJson).forEach(sqlKey => {
                connection.query(sqlJson[sqlKey], (err, result) => {
                    dataJson[sqlKey] = result[0];
                    connection.release();
                })
            })
        })

        await wait(300);
        rs(dataJson);
    })
}

module.exports = { getProductById, getSoilTypeById, getGraphicsBoxDataAll, getGraphicsChartsDataAll };
module.exports.database = mysqlPool;