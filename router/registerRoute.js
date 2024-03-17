const Express = require("express");
const Router = Express.Router();
const admin = require("../model/adminSchema");
const subjects = require("../assets/semesterSubjects");

Router.post("/RegisterAdmin", async (req, res) => {
    try {
        const { sem, userId, password, subject, key } = req.body;

        if (
            !userId ||
            !password ||
            !sem ||
            !subject ||
            sem < 1 ||
            sem > 7 ||
            !key
        ) {
            return res.status(400).json({ status: 400 }); //missing field
        }
        if (key != process.env.SECRET_KEY) {
            return res.status(403).json({ status: 403 }); //not Authorized
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

        let flag = -1;
        for (let i = 0; i < subjects[sem].length; i++) {
            if (subjects[sem][i].subjectCode == subject) {
                flag = i;
            }
        }

        if (flag === -1) {
            return res.status(403).json({ status: 403 }); //invalid subject code
        }

        const user = new admin({
            adminUserId: userId,
            adminPassword: password,
            adminStatus: req.body.status ? req.body.status : false,
            adminSemester: sem,
            adminSubject: subjects[sem][flag].subjectName,
            adminSubjectCode: subject,
        });

        await user.save();
        res.status(201).send({ status: 201 });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 500 }); //Internal server error
    }
});

module.exports = Router;
