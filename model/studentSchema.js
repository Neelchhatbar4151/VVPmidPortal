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
                default: 0,
            },
            mid2: {
                type: Number,
                default: 0,
            },
        },
    ],
});

// module.exports.sem1 = Mongoose.model("sem1", semesterSchema);
// module.exports.sem2 = Mongoose.model("sem2", semesterSchema);
// module.exports.sem3 = Mongoose.model("sem3", semesterSchema);
// module.exports.sem4 = Mongoose.model("sem4", semesterSchema);
// module.exports.sem5 = Mongoose.model("sem5", semesterSchema);
// module.exports.sem6 = Mongoose.model("sem6", semesterSchema);
// module.exports.sem7 = Mongoose.model("sem7", semesterSchema);
module.exports = [
    Mongoose.model("sem1", semesterSchema),
    Mongoose.model("sem2", semesterSchema),
    Mongoose.model("sem3", semesterSchema),
    Mongoose.model("sem4", semesterSchema),
    Mongoose.model("sem5", semesterSchema),
    Mongoose.model("sem6", semesterSchema),
    Mongoose.model("sem7", semesterSchema),
];
