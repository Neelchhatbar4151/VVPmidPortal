const Express = require("express");
const Router = Express.Router();
const admin = require("../model/adminSchema.js");
// const semester = require("../model/studentSchema.js");

Router.post("/removeAdmin", async (req, res) => {
    try {
        const { id, key } = req.body;
        if (!id || !key) {
            return res.status(400).json({ status: 400 });
        }
        if (key != process.env.TRANSACTION_KEY) {
            return res.status(403).json({ status: 403 }); //not Authorized
        }
        const result = await admin.deleteOne({ _id: id });
        if (!result) {
            throw Error;
        }
        return res.status(200).json({ status: 200 });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500 });
    }
});

module.exports = Router;
