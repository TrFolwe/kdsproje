const express = require('express');
const router = express.Router();
const dbConn = require('../db/dbconnect');

router.get('/uretim_satis_verileri', (req, res) => {
  dbConn.query("select * from uretim_miktari", (err, results) => {
    if (err) {
      console.error('Veri çekme hatası: ', err);
      res.status(500).json({ error: 'Veri çekme hatası' });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;