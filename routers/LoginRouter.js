const express = require("express");
const path = require("path");
const { database } = require("../database/MySQLDatabase");
const router = express.Router();
//LOGIN GET

router.get("/", (req, res) => {
    if (req.session.isAuthenticated) return res.redirect("/");
    res.sendFile(path.join(__dirname, "../views/login.html"));
});

router.post("/", express.urlencoded({ extended: false }), (req, res) => {
    const { username, password } = req.body;

    database.query(`SELECT * FROM kullanici WHERE kullanici_ad = ?`, [username], (err, results) => {
        if (err) throw err;

        const result = results[0];

        if (!result) {
            return res.json({
                error: true,
                message: `Kullanıcı bulunamadı!`
            })
        }

        if (result.sifre !== password) {
            return res.json({
                error: true,
                message: `Şifre yanlış!`
            })
        }

        req.session.isAuthenticated = true;
        req.session.user = { username, name: result.ad };

        res.json({
            message: "Giriş başarılı"
        })
    })
})


module.exports = router;