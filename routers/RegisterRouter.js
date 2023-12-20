const express = require("express");
const path = require("path");
const router = express.Router();

const { database } = require("../database/MySQLDatabase");

router.use(express.json());

//LOGIN GET

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/register.html"));
});

router.post("/", (req, res) => {
    const { name, surname, username, password, email } = req.body;

    database.query(`INSERT INTO kullanici(ad, soyad, email, kullanici_ad, sifre) VALUES(?,?,?,?,?)`, [name, surname, email, username, password], (err, result) => {
        if (err) throw err;
        res.json({
            message: "Kayıt oldun, yönlendiriliyorsunuz..."
        });
    });
})

module.exports = router;