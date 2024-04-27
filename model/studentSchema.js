const Mongoose = require("mongoose");

const semesterSchema = new Mongoose.Schema({
    studentEnrollment: {
        type: Number,
        required: true,
        unique: true,
    },

    studentName: {
        type: String,
        required: true,
    },

    studentPassword: {
        type: String,
        required: true,
    },

    studentMarks: [
        {
            subjectName: {
                type: String,
                required: true,
            },
            subjectCode: {
                type: Number,
                required: true,
            },
            mid1: {
                type: Number,
                default: null,
            },
            mid2: {
                type: Number,
                default: null,
            },
        },
    ],
});

module.exports = [
    Mongoose.model("sem1", semesterSchema),
    Mongoose.model("sem2", semesterSchema),
    Mongoose.model("sem3", semesterSchema),
    Mongoose.model("sem4", semesterSchema),
    Mongoose.model("sem5", semesterSchema),
    Mongoose.model("sem6", semesterSchema),
    Mongoose.model("sem7", semesterSchema),
];
