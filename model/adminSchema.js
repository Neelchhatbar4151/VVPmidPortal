const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");

const adminSchema = new Mongoose.Schema({
    adminUserId: {
        type: String,
        required: true,
        unique: true,
    },

    adminPassword: {
        type: String,
        required: true,
    },

    adminSubject: {
        type: String,
        required: true,
    },

    adminSubjectCode: {
        type: Number,
        required: true,
    },

    adminStatus: {
        type: Boolean,
        default: false,
    },

    adminSemester: {
        type: Number,
        required: true,
    },

    adminTokens: [
        {
            adminToken: {
                type: String,
            },
        },
    ],
});

adminSchema.methods.GenerateAuthToken = async function () {
    try {
        let token = Jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.adminTokens = this.adminTokens.concat({ adminToken: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
};

adminSchema.pre("save", async function (next) {
    if (this.isModified("adminPassword")) {
        this.adminPassword = await Bcrypt.hash(this.adminPassword, 12);
    }
    next();
});

const Collection = Mongoose.model("admin", adminSchema);
module.exports = Collection;
