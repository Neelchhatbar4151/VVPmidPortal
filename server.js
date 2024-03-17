const Dotenv = require("dotenv");
const Express = require("express");
const App = Express();
const Cors = require("cors");
const Path = require("path");
const mongoose = require("mongoose");

Dotenv.config({ path: "./config.env" });

App.use(Cors());

App.use(Express.json());

const PORT = process.env.PORT || 5000;

App.use(Express.static(Path.join()));

const path = require("path");

App.use(require("./router/Routes.js"));

const DB = process.env.DATABASE;

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connection successfull");
        App.listen(PORT);
        App.use(Express.static("client/build"));
        App.get("*", (req, res) => {
            res.sendFile(
                path.resolve(__dirname, "client", "build", "index.html")
            );
        });
    })
    .catch((err) => {
        console.log(err);
    });
