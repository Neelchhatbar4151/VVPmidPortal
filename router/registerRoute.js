const Express = require("express");
const Router = Express.Router();
const admin = require("../model/adminSchema");

Router.post("/RegisterAdmin", async (req, res) => {
    try {
        const { sem, userId, password, subject } = req.body;

        if (!userId || !password || !sem || !subject || sem < 1 || sem > 7) {
            return res.status(400).json({ status: 400 }); //missing field
        }

        const Exist = await admin.findOne(
            { adminUserId: userId },
            {
                _id: 1,
            }
        );

        if (Exist) {
            return res.status(422).json({ status: 422 }); //Already Exist
        }

        const user = new admin({
            adminUserId: userId,
            adminPassword: password,
            adminStatus: req.body.status ? req.body.status : DEFUALT,
            adminSemester: sem,
            adminSubject: subject,
        });

        await user.save();
        res.status(201).send({ status: 201 });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 500 }); //Internal server error
    }
});

module.exports = Router;
