const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    universityName: String,
    universityShortName: String,
    departmentName: String,
    departmentShortName: String,
    name: String,
    shortName:String,
}, {timespamps: true}
);

const DegreeCourse = mongoose.model("DegreeCourse", CourseSchema)

module.exports = DegreeCourse