const express = require("express");
const router = express.Router();
const courseApplicationService = require("./DegreeCourseApplicationService");
const utils = require("../utils/AuthenticationUtils");

/* GET */

router
  .get("/", utils.isAuthenticated, function (req, res, next) {
    if (Object.entries(req.query).length <= 0) {
      courseApplicationService.getCourseApplications(function (err, results) {
        if (err) res.status(500).json({ Error: err });
        else res.status(200).json(results);
      });
    } else {
      courseApplicationService.getApplicationByQuery(
        Object.entries(req.query)[0][0],
        Object.entries(req.query)[0][1],
        function (err, results) {
          if (err) res.status(500).json({ Error: err });
          else res.status(200).json(results);
        }
      );
    }
  })
  .get("/myApplications", utils.isAuthenticated, function (req, res, next) {
    if (Object.entries(req.query).length <= 0)
      courseApplicationService.getCourseApplicationsCurrentUser(
        req.headers.authorization,
        function (err, results) {
          if (err) res.status(500).json({ Error: err });
          else res.status(200).json(results);
        }
      );
  });

/* POST */

router.post("/", utils.isAuthenticated, function (req, res, next) {
  /* console.log(req.body) */
  courseApplicationService.checkCourseApplicationExists(
    req,
    function (err, application) {
      if (err) res.status(500).json(err);
      var user = undefined;
      if (!utils.isAdminBool(req))
        user = courseApplicationService.getApplicantID(
          req.headers.authorization
        );
      if (application)
        res.status(400).json({ Error: "Application allready exists." });
      else {
        /* console.log(req.body) */
        courseApplicationService.createCourseApplication(
          req,
          user,
          function (err, createdApplication) {
            if (err) res.status(500).json(err);
            else res.json(createdApplication);
          }
        );
      }
    }
  );
});

/* PUT */

router.put(
  "/:application",
  utils.isAuthenticated,
  utils.isAdmin,
  function (req, res, next) {
    courseApplicationService.findCourseApplicationByCourseID(
      req.params.application,
      function (err, application) {
        if (err) res.status(500).json({ Error: err });
        else {
          if (!application)
            res.status(400).json({ Error: "No course could be found." });
          else {
            courseApplicationService.updateApplication(
              req.params.application,
              req.body,
              function (err, updatedApplication) {
                if (err) res.status(500).json({ Error: err });
                else res.status(200).send(updatedApplication);
              }
            );
          }
        }
      }
    );
  }
);

/* DELETE */

router.delete(
  "/:application",
  utils.isAuthenticated,
  utils.isAdmin,
  function (req, res, next) {
    courseApplicationService.findCourseApplicationByCourseID(req.params.application, function (err, application) {
      if (err) res.status(500).json({ Error: err });
      else {
        if (!application) {
          res.status(400).json({ Error: "No application could be found." });
        } else {
          courseApplicationService.deleteApplication(
            req.params.application,
            function (err, deletedCourse) {
              if (err) res.status(500).json({ Error: err });
              else res.status(204).send();
            }
          );
        }
      }
    });
  }
);

module.exports = router;