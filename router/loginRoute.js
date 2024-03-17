const Express = require("express");
const Router = Express.Router();
const admin = require("../model/adminSchema");

Router.post("/LoginAdmin", async (req, res) => {
    try {
        const { sem, userId, password } = req.body;

        if (!userId || !password || !sem) {
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
module.exports = Router;
