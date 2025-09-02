const CourseApplication = require("./DegreeCourseApplicationModel");
const CourseService = require("../degreeCourses/DegreeCourseService");

function getCourseApplications(callback) {
  CourseApplication.find(function (err, courseApplication) {
    if (err) callback(err, null);
    else callback(null, courseApplication);
  });
}

function getCourseApplicationsCurrentUser(header, callback) {
  userID = getApplicantID(header);
  if (!userID) callback("userID is invalid.", null);
  else {
    var query = CourseApplication.find({ applicantUserID: userID });
    query.exec(function (err, application) {
      if (err) callback(err, null);
      else {
        if (application) callback(null, application);
        else callback(null, null);
      }
    });
  }
}

function findCourseApplicationByCourseID(searchCourseApplicationID, callback) {
  if (!searchCourseApplicationID) callback("No courseID given.", null);
  else {
    var query = CourseApplication.findOne({ id: searchCourseApplicationID });
    query.exec(function (err, application) {
      if (err) callback(err, null);
      else {
        if (application) callback(null, application);
        else callback(null, null);
      }
    });
  }
}

function createCourseApplication(req, user, callback) {
  if (!req) callback("No jsonBody given.", null);
  else {
    if (!req.body.degreeCourseID) callback("No course id given.", null);
    CourseService.findCourseByID(req.body.degreeCourseID,
      function (err, course) {
        if (!course) return callback("Course does not exist.", null);
        if (course) {
          var newApplication = new CourseApplication({
            degreeCourseID: req.body.degreeCourseID,
            targetPeriodYear: req.body.targetPeriodYear,
            targetPeriodShortName: req.body.targetPeriodShortName,
          });
          if (req.body.applicantUserID === undefined)
            newApplication.set({ applicantUserID: user });
          else
            newApplication.set({ applicantUserID: req.body.applicantUserID });
          newApplication.save(function (err, createdApplication) {
            if (err) callback(err, null);
            else callback(null, createdApplication);
          });
        } else callback(err, null);
      });
  }
}

function getApplicantID(header) {
  if (typeof header == "undefined") console.log("Error in getApplicantID");
  else {
    var applicantID = Buffer.from(header.split(" ")[1], "base64")
      .toString("ascii")
      .split(".")[0];
    return applicantID.split('"userID":"')[1].split('","isAdmin')[0];
  }
}

function checkCourseApplicationExists(req, callback) {
  if (!req) callback("Request invalid.", null);
  else {
    userID = req.body.applicantUserID;
    if (!userID) userID = getApplicantID(req.headers.authorization);
    var query = CourseApplication.findOne({
      degreeCourseID: req.body.degreeCourseID,
      applicantUserID: userID,
    });
    query.exec(function (err, application) {
      if (err) callback(err, null);
      else {
        if (application) {
          callback(null, application);
        } else callback(null, null);
      }
    });
  }
}

function updateApplication(searchApplicationID, updateParams, callback) {
  if (!searchApplicationID) callback("No courseID given.", null);
  else {
    CourseApplication.findOneAndUpdate(
      { id: searchApplicationID },
      updateParams,
      { new: true },
      function (err, res) {
        if (err) callback(err, null);
        else callback(null, res);
      }
    );
  }
}

function getApplicationByQuery(key, value, callback) {
  if(!key || !value) callback("Query parameters are falty.", null)
  CourseApplication.find({ [key]: value }, function (err, application) {
    if (err) callback(err, null);
    else callback(null, application);
  });
}

function deleteApplication(searchApplicationID, callback) {
  if (!searchApplicationID) callback("No applicationID given.", null);
  else {
    CourseApplication.findOneAndDelete({ id: searchApplicationID }, function (err, res) {
      if (err) callback(err, null);
      else callback(null, res);
    });
  }
}

module.exports = {
  findCourseApplicationByCourseID,
  createCourseApplication,
  getCourseApplications,
  getCourseApplicationsCurrentUser,
  updateApplication,
  getApplicationByQuery,
  checkCourseApplicationExists,
  getApplicantID,
  deleteApplication
};
