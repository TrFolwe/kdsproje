const router = require("express").Router();

const { database, getProductById } = require("../database/MySQLDatabase")

const isAuthMiddleware = (req, res, next) => {
    if (!req.session.isAuthenticated) return res.redirect("/login");
    next();
}

router.get("/", isAuthMiddleware, (req, res) => {
    console.log(req.user)
    res.render("veri_girisi", { user: req.session.user });
});

router.get("/iklim_hava_kosullari", isAuthMiddleware, (req, res) => {
    res.render("iklim_hava_kosullari", { user: req.session.user });
});

router.get("/veri_girisi", isAuthMiddleware, (req, res) => {
    res.render("veri_girisi", { user: req.session.user });
});

router.get("/uretim_satis_verileri", isAuthMiddleware, (req, res) => {
    res.render("uretim_satis_verileri", { user: req.session.user });
});

router.get("/urun_toprak_bilgileri", isAuthMiddleware, (req, res) => {
    res.render("urun_toprak_bilgileri", { user: req.session.user });
});

router.get("/grafikler", isAuthMiddleware, (req, res) => {
    res.render("grafikler", { user: req.session.user });
});

router.get("/veriler", (req, res) => {
    const { type } = req.query;
    database.getConnection((err, connection) => {
        if (err) throw err;
        switch (type) {
            case "farm":
                connection.query(`SELECT * FROM tarla`, (err, result) => {
                    Array.from(result).map(v => {
                        const urunId = v.urun_id;
                        if (!urunId) v.urun_id = "Ürün, ekilmedi!";
                    });
                    res.json(result);
                    connection.destroy();
                })
                break;
            case "product":
                connection.query(`SELECT * FROM urun`, (err, result) => {
                    res.json(result);
                    connection.destroy();
                })
                break;
            //Satış verileri
            case "product_sell":
                connection.query(`SELECT * FROM satis_miktari`, async (err, result) => {
                    res.json(result);
                    connection.destroy();
                })
                break;
            //Üretim verileri
            case "product_production":
                connection.query(`SELECT * FROM uretim_miktari`, (err, result) => {
                    res.json(result);
                    connection.destroy();
                })
                break;
        }
    })
});

module.exports = router;