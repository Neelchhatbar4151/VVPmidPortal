const Express = require("express");
const Router = Express.Router();
const Bcrypt = require("bcrypt");
const admin = require("../model/adminSchema");
const semester = require("../model/studentSchema");

Router.post("/LoginAdmin", async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({ status: 400 }); //missing field
        }

        const Exist = await admin.findOne(
            { adminUserId: userId },
            {
                adminPassword: 1,
                adminSemester: 1,
                adminTokens: 1,
                adminStatus: 1,
            }
        );

        if (!Exist) {
            return res.status(401).json({ status: 401 }); //Incorrect userId
        }

        const ismatch = await Bcrypt.compare(password, Exist.adminPassword);

        if (!ismatch) {
            return res.status(401).json({ status: 401 }); //Incorrect Password
        } else {
            if (Exist.adminStatus) {
                const token = await Exist.GenerateAuthToken();
                return res
                    .status(202)
                    .json({ status: 202, id: Exist._id, token }); //login successfull
            } else {
                return res.status(403).json({ status: 403 }); //not Authorized by admin
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 500 }); //Internal server error
    }
});

Router.post("/superAdminLogin", async (req, res) => {
    try {
        const { userId, password } = req.body;
        if (!userId || !password) {
            return res.status(400).json({ status: 400 }); //missing field
        }
        if (userId == process.env.userId && password == process.env.password) {
            return res.status(200).json({ status: 200 });
        }
        return res.status(401).json({ status: 401 }); //Incorrect Email or Password
    } catch (error) {
        console.log(err);
        return res.status(500).json({ status: 500 }); //Internal server error
    }
});

Router.post("/studentLogin", async (req, res) => {
    try {
        const { userId, password, sem } = req.body;
        if (!userId || !password || !sem || sem < 1 || sem > 7) {
            return res.status(400).json({ status: 400 }); //missing field
        }
        const Exist = await semester[sem - 1].findOne(
            { studentEnrollment: userId },
            {
                studentName: 1,
                studentEnrollment: 1,
                studentMarks: 1,
                studentPassword: 1,
            }
        );

        if (!Exist) {
            return res.status(401).json({ status: 401 }); //Incorrect userId
        }
        const ismatch = Exist.studentPassword == password;
        delete Exist["studentPassword"];
        if (!ismatch) {
            return res.status(401).json({ status: 401 }); //Incorrect Password
        }
        return res.status(202).json({
            status: 202,
            data: {
                studentName: Exist.studentName,
                studentEnrollment: Exist.studentEnrollment,
                studentMarks: Exist.studentMarks,
                studentSem: sem,
            },
        }); //login successfull
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500 }); //Internal Server Error
    }
});
module.exports = Router;
