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
        if (key != process.env.TRANSACTION_KEY) {
            return res.status(403).json({ status: 403 }); //not Authorized
        }
        for (let i = 0; i < students.length; i++) {
            if (
                !students[i].enrollment ||
                !students[i].name ||
                !students[i].password
            ) {
                return res.status(400).json({ status: 400 }); //missing field
            }

            const Exist = await semester[sem - 1].findOne(
                { studentEnrollment: students[i].enrollment },
                {
                    _id: 1,
                }
            );

            if (!Exist) {
                const user = new semester[sem - 1]({
                    studentEnrollment: students[i].enrollment,
                    studentName: students[i].name,
                    studentPassword: students[i].password,
                    studentMarks: subjects[sem],
                });
                await user.save();
            }
        }
        res.status(201).send({ status: 201 }); //User created
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500 }); //Internal Server Error
    }
});

Router.post("/removeAllStudents", async (req, res) => {
    try {
        const { sem, key } = req.body;
        if (!sem || sem < 1 || sem > 7 || !key) {
            return res.status(400).json({ status: 400 }); //invalid field
        }
        if (key != process.env.TRANSACTION_KEY) {
            return res.status(403).json({ status: 403 }); //not Authorized
        }
        await semester[sem - 1].deleteMany({});
        res.status(201).send({ status: 201 }); //ok
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
        if (key != process.env.TRANSACTION_KEY) {
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

Router.post("/getData", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ status: 400 });
        }
        const verifyToken = Jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await admin.findOne({
            _id: verifyToken._id,
            "adminTokens.adminToken": token,
        });
        if (!rootUser) {
            return res.status(402).json({ status: 402 });
        }
        req.token = token;
        req.rootUser = rootUser;
        return res.status(200).json({ status: 200, data: req.rootUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500 });
    }
});

Router.post("/listStudents", async (req, res) => {
    try {
        const { token, key, sem } = req.body;
        if (!token && !key) {
            return res.status(400).json({ status: 400 });
        }
        if (key) {
            if (!sem) {
                return res.status(400).json({ status: 400 });
            }

            if (key != process.env.TRANSACTION_KEY) {
                return res.status(403).json({ status: 403 }); //not Authorized
            }
            const students = await semester[sem - 1].find({});
            return res.status(200).json({ status: 200, data: students });
        } else {
            const verifyToken = Jwt.verify(token, process.env.SECRET_KEY);
            const rootUser = await admin.findOne({
                _id: verifyToken._id,
                "adminTokens.adminToken": token,
            });
            if (!rootUser) {
                return res.status(402).json({ status: 402 });
            }
            const sem = rootUser.adminSemester;
            const students = await semester[sem - 1].find({});
            return res.status(200).json({ status: 200, data: students });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500 });
    }
});

Router.post("/listAdmins", async (req, res) => {
    try {
        const admins = await admin.find(
            {},
            { adminSubjectCode: 1, adminUserId: 1, adminSemester: 1 }
        );
        return res.status(200).json({ status: 200, data: admins });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500 });
    }
});

const max = (a, b) => {
    if (a < b) {
        return b;
    }
    return a;
};

Router.post("/getHighest", async (req, res) => {
    try {
        const { sem } = req.body;
        const students = await semester[sem - 1].find({});
        let list = [];
        for (let i = 0; i < students[0].studentMarks.length; i++) {
            list.push({
                subjectCode: students[0].studentMarks[i].subjectCode,
                subject: students[0].studentMarks[i].subjectName,
                mid1: 0,
                mid2: 0,
            });
            for (let j = 0; j < students.length; j++) {
                list[i].mid1 = max(
                    list[i].mid1,
                    students[j].studentMarks[i].mid1
                );
                list[i].mid2 = max(
                    list[i].mid2,
                    students[j].studentMarks[i].mid2
                );
            }
        }
        return res.status(200).json({ status: 200, data: list });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500 });
    }
});
module.exports = Router;
