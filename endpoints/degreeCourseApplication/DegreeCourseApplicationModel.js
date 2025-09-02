const mongoose = require('mongoose')

const ApplicationSchema = new mongoose.Schema({
    degreeCourseID: String,
    applicantUserID: String,
    targetPeriodYear: Number,
    targetPeriodShortName: String,
}, {timespamps: true}
);

const DegreeCourseApplication = mongoose.model("DegreeCourseApplication", ApplicationSchema)

module.exports = DegreeCourseApplication