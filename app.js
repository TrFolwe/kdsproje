require('dotenv/config')
const express = require("express");
const path = require("path")
const session = require("express-session");
const app = express()

app.use(session({
  secret: "proje",
  resave: false,
  saveUninitialized: true,
}));
app.use(require("cookie-parser")());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"))

app.use("/static", express.static(path.join(__dirname, "./static")))
app.use("/login", require("./routers/LoginRouter"))
app.use("/register", require("./routers/RegisterRouter"))
app.use("/", require("./routers/RedirectRouters"));
app.use("/", require("./routers/PostRouters"));

app.listen(process.env.PORT, () => console.log(`Server listening on ${process.env.PORT}`))
