
const express = require("express");

const path = require("path")
require('dotenv/config')

const dbConn = require('./db/dbconnect')

const app = express()

app.use("/static", express.static(path.join(__dirname, "./static")))

const uruntoprakRouter = require("./routers/urun_toprak_router")
const uretimsatisRouter = require("./routers/uretim_satis_router")
const grafiklerRouter = require("./routers/grafikler_router")
const verigirisiRouter = require("./routers/veri_girisi_router")


app.use('/urun_toprak_verileri', uruntoprakRouter);
/*
app.use('/uretim_satis_verileri', path.join(__dirname, "uretim_satis_verileri.html"));
app.use('/grafikler', grafiklerRouter);
app.use('/veri_girisi', verigirisiRouter);*/


app.get('/', function (req, res) {
  res.json(`Sunucu ${process.env.PORT} Portunda Çalışıyor.."`)
})

app.get('/urun_toprak_bilgileri', function (req, res) {
  res.sendFile(path.join(__dirname, "./pages/urun_toprak_bilgileri.html"))
})

app.get('/iklim_hava_kosullari', function (req, res) {
  res.sendFile(path.join(__dirname, "./pages/iklim_hava_kosullari.html"))
})

app.get('/grafikler', function (req, res) {
  res.sendFile(path.join(__dirname, "./pages/grafikler.html"))
})

app.get('/uretim_satis_verileri', function (req, res) {
  res.sendFile(path.join(__dirname, "./pages/uretim_satis_verileri.html"))
})

app.get('/veri_girisi', function (req, res) {
  res.sendFile(path.join(__dirname, "./pages/veri_girisi.html"))
});

app.use(express.json());
app.listen(process.env.PORT)
