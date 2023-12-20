const router = require("express").Router();

router.post("/tarla_ekle", (req, res) => {
    const { tarla_m2, product_id, toprak_tip_id } = req.body;
    database.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(`INSERT INTO tarla(tarla_m2, toprak_tip_id, urun_id) VALUES(?,?,?)`, [tarla_m2, toprak_tip_id, product_id], (err, result) => {
            if (err) throw err;
            res.json({
                message: "Başarıyla eklendi!"
            })
        });
    })
})

router.post("/urun_ekle", (req, res) => {
    const productName = req.body.urun_ad;
    database.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(`INSERT INTO urun(urun_ad) VALUES(?)`, [productName], (err, result) => {
            if (err) throw err;
            res.json({
                message: `Başarıyla ${productName} adlı ürün eklendi!`
            })
        });
    })
})

module.exports = router;