const express = require('express');
const router = express.Router();

const { JSDOM } = require("jsdom");

global.document = new JSDOM("").window.document;

// ... Router'a yönlendirmeleri ekle ...
const json = [{ "tarla_id": 1, "urun_id": 1, "tarla_m2": 1500, "toprak_tip_id": 1 }, { "tarla_id": 2, "urun_id": 3, "tarla_m2": 1200, "toprak_tip_id": 3 }, { "tarla_id": 3, "urun_id": 3, "tarla_m2": 1000, "toprak_tip_id": 4 }, { "tarla_id": 4, "urun_id": 2, "tarla_m2": 1100, "toprak_tip_id": 2 }, { "tarla_id": 5, "urun_id": 1, "tarla_m2": 1500, "toprak_tip_id": 2 }, { "tarla_id": 6, "urun_id": 3, "tarla_m2": 1000, "toprak_tip_id": 3 }, { "tarla_id": 7, "urun_id": 1, "tarla_m2": 2000, "toprak_tip_id": 2 }, { "tarla_id": 8, "urun_id": 1, "tarla_m2": 900, "toprak_tip_id": 1 }, { "tarla_id": 9, "urun_id": 2, "tarla_m2": 800, "toprak_tip_id": 3 }, { "tarla_id": 10, "urun_id": 10, "tarla_m2": 900, "toprak_tip_id": 2 }, { "tarla_id": 11, "urun_id": 3, "tarla_m2": 2400, "toprak_tip_id": 1 }, { "tarla_id": 12, "urun_id": 2, "tarla_m2": 500, "toprak_tip_id": 4 }, { "tarla_id": 13, "urun_id": 1, "tarla_m2": 3000, "toprak_tip_id": 3 }, { "tarla_id": 14, "urun_id": 3, "tarla_m2": 1150, "toprak_tip_id": 1 }, { "tarla_id": 15, "urun_id": 2, "tarla_m2": 1000, "toprak_tip_id": 2 }, { "tarla_id": 16, "urun_id": 3, "tarla_m2": 2000, "toprak_tip_id": 2 }, { "tarla_id": 17, "urun_id": 1, "tarla_m2": 5100, "toprak_tip_id": 3 }, { "tarla_id": 18, "urun_id": 18, "tarla_m2": 1000, "toprak_tip_id": 4 }, { "tarla_id": 19, "urun_id": 2, "tarla_m2": 1100, "toprak_tip_id": 3 }, { "tarla_id": 20, "urun_id": 1, "tarla_m2": 2750, "toprak_tip_id": 2 }, { "tarla_id": 21, "urun_id": 1, "tarla_m2": 3500, "toprak_tip_id": 3 }, { "tarla_id": 22, "urun_id": 2, "tarla_m2": 2200, "toprak_tip_id": 2 }, { "tarla_id": 23, "urun_id": 3, "tarla_m2": 4000, "toprak_tip_id": 1 }, { "tarla_id": 24, "urun_id": 2, "tarla_m2": 2250, "toprak_tip_id": 4 }, { "tarla_id": 25, "urun_id": 1, "tarla_m2": 8550, "toprak_tip_id": 2 }, { "tarla_id": 26, "urun_id": 2, "tarla_m2": 5000, "toprak_tip_id": 1 }, { "tarla_id": 27, "urun_id": 3, "tarla_m2": 6500, "toprak_tip_id": 3 }, { "tarla_id": 28, "urun_id": 2, "tarla_m2": 7400, "toprak_tip_id": 2 }, { "tarla_id": 29, "urun_id": 1, "tarla_m2": 9000, "toprak_tip_id": 2 }, { "tarla_id": 30, "urun_id": 2, "tarla_m2": 6500, "toprak_tip_id": 3 }];

router.get("/", (req, res) => {
  res.json(json);
});



const dbConn = require('../db/dbconnect');

router.get('/', (req, res) => {
  dbConn.query('SELECT * FROM tarla', (err, results) => {
    if (err) {
      console.error('Veri çekme hatası: ', err);
      res.status(500).send('Veri çekme hatası');
    } else {
      res.json(results);
    }
  });
});

module.exports = router;