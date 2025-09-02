const Course = require("./DegreeCourseModel");

function getCourses(callback) {
  Course.find(function (err, course) {
    if (err) callback(err, null);
    else callback(null, course);
  });
}

function findCourseByID(searchCourseID, callback) {
  if (!searchCourseID) callback("No courseID given.", null);
  else {
    var query = Course.findOne({ _id: searchCourseID });
    query.exec(function (err, course) {
      if (err) callback(err, null);
      else {
        if (course) callback(null, course);
        else callback(null, null);
      }
    });
  }
}

function createCourse(jsonBody, callback) {
  if (!jsonBody) callback("No jsonBody given.", null);
  else {
    create();
    async function create() {
      let result = await Course.create({
        universityName: jsonBody.universityName,
        universityShortName: jsonBody.universityShortName,
        departmentName: jsonBody.departmentName,
        departmentShortName: jsonBody.departmentShortName,
        name: jsonBody.name,
        shortName: jsonBody.shortName,
      });
      callback(null, result);
    }
  }
}

function updateCourse(searchCourseID, updateParams, callback) {
  if (!searchCourseID) callback("No courseID given.", null);
  else {
    Course.findOneAndUpdate(
      { id: searchCourseID },
      updateParams,
      { new: true },
      function (err, res) {
        if (err) callback(err, null);
        else callback(null, res);
      }
    );
  }
}

function deleteCourse(searchCourseID, callback) {
  if (!searchCourseID) callback("No courseID given.", null);
  else {
    Course.findOneAndDelete({ id: searchCourseID }, function (err, res) {
      if (err) callback(err, null);
      else callback(null, res);
    });
  }
}

function getCourseByQuery(key, value, callback) {
  if (!key || !value) callback("Query parameters are falty.", null);
  Course.find({ [key]: value }, function (err, application) {
    if (err) callback(err, null);
    else callback(null, application);
  });
}

function getCourseCurrentUser(header, callback) {
  userID = getApplicantID(header);
  if (!userID) callback("userID is invalid.", null);
  else {
    var query = Course.find({ applicantUserID: userID });
    query.exec(function (err, course) {
      if (err) callback(err, null);
      else {
        if (course) callback(null, course);
        else callback(null, null);
      }
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

module.exports = {
  getCourses,
  findCourseByID,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseByQuery,
  getCourseCurrentUser,
  getApplicantID
};
