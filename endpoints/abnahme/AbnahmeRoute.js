const express = require("express");
const router = express.Router();
const utils = require("../utils/AuthenticationUtils");

const userService = require("../user/UserService");
const courseService = require("../degreeCourses/DegreeCourseService");

/* GET */

router
  .get("/getMyData", utils.isAuthenticated, function (req, res) {
    getMyData(
        req.headers.authorization,
        function (err, result) {
          if (err) res.status(500).json({ Error: err });
          else {
            res.status(200).json(result);
          }
        }
      );
  });

function getMyData(auth, callback) {
    if(!auth) callback("No authentication header given.", null)
    var userID = getApplicantID(auth)
    var response = {};

    if(!userID) callback("Authentication Invalid", null);
    else{
        userService.findUserByID(userID, function(err, userBody){
            if(err) callback("Error when searching User.", null)
            else {
                response.user = userBody;
                courseService.getCourseCurrentUser(auth, function(err, courses) {
                    if(err) callback("Error when searching appliactions.", null)
                    else {
                        response.applications = courses
                        if(!response) callback("No Data found.", null)
                        else callback(null, response)
                    }
                })
            }
        })
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

module.exports = router;