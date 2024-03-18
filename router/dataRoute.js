const Express = require("express");
const Router = Express.Router();
const admin = require("../model/adminSchema.js");
const semester = require("../model/studentSchema.js");
const subjects = require("../assets/semesterSubjects.js");
const Jwt = require("jsonwebtoken");

Router.post("/studentEntry", async (req, res) => {
    try {
        const { students, sem, key } = req.body;
        if (!sem || sem < 1 || sem > 7 || !key) {
            return res.status(400).json({ status: 400 }); //invalid field
        }
        if (key != process.env.SECRET_KEY) {
            return res.status(403).json({ status: 403 }); //not Authorized
        }
        for (let i = 0; i < students.length; i++) {
            if (
                !students[i].studentEnrollment ||
                !students[i].studentName ||
                !students[i].studentPassword
            ) {
                return res.status(400).json({ status: 400 }); //missing field
            }

            const Exist = await semester[sem - 1].findOne(
                { studentEnrollment: students[i].studentEnrollment },
                {
                    _id: 1,
                }
            );

            if (Exist) {
                return res.status(422).json({ status: 422 }); //Already Exist
            }
            const user = new semester[sem - 1]({
                studentEnrollment: students[i].studentEnrollment,
                studentName: students[i].studentName,
                studentPassword: students[i].studentPassword,
                studentMarks: subjects[sem],
            });
            await user.save();
        }
        res.status(201).send({ status: 201 }); //User created
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500 }); //Internal Server Error
    }
});

Router.post("/removeStudent", async (req, res) => {
    try {
        const { students, sem, key } = req.body;
        if (!sem || sem < 1 || sem > 7 || !key) {
            return res.status(400).json({ status: 400 }); //invalid field
        }
        if (key != process.env.SECRET_KEY) {
            return res.status(403).json({ status: 403 }); //not Authorized
        }
        for (let i = 0; i < students.length; i++) {
            if (!students[i]._id) {
                return res.status(400).json({ status: 400 }); //missing field
            }
            await semester[sem - 1].deleteOne({ _id: students[i]._id });
        }
        res.status(201).send({ status: 201 }); //ok
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500 }); //Internal Server Error
    }
});

Router.post("/updateStudent", async (req, res) => {
    try {
        const { students, sem, token, subjectCode } = req.body;
        if (!sem || sem < 1 || sem > 7 || !token || !subjectCode) {
            return res.status(400).json({ status: 400 }); //invalid field
        }

        const verifyToken = Jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await admin.findOne({
            _id: verifyToken._id,
            "adminTokens.adminToken": token,
        });

        if (!rootUser) {
            return res.status(403).json({ status: 403 }); //Not authorized
        }

        for (let i = 0; i < students.length; i++) {
            const data = await semester[sem - 1].updateOne(
                {
                    _id: students[i]._id,
                    "studentMarks.subjectCode": subjectCode,
                },
                {
                    $set: {
                        "studentMarks.$.mid1": students[i].mid1,
                        "studentMarks.$.mid2": students[i].mid2,
                    },
                }
            );
        }
        return res.status(200).json({ status: 200 });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500 });
    }
});

module.exports = Router;
