const express = require("express");
const router = express.Router();
const courseService = require("./DegreeCourseService");
const utils = require("../utils/AuthenticationUtils");

/* GET */

router
  .get("/", utils.isAuthenticated, utils.isAdmin, (req, res, next) => {
    if (Object.entries(req.query).length <= 0)
      courseService.getCourses(function (err, results) {
        if (err) res.status(500).json({ Error: err });
        else res.status(200).json(results);
      });
    else
      courseService.getCourseByQuery(
        Object.entries(req.query)[0][0],
        Object.entries(req.query)[0][1],
        function (err, results) {
          if (err) res.status(500).json({ Error: err });
          else res.status(200).json(results);
        }
      );
  })
  .get("/:id", utils.isAuthenticated, utils.isAdmin, function (req, res, next) {
    courseService.findCourseByID(req.params.id, function (err, course) {
      if (err) res.status(500).json({ Error: err });
      else {
        if (course) res.status(200).json(course);
        else res.status(404).json({ Error: "No admin-course could be found." });
      }
    });
  })
  .get("/:degreeCourseID/degreeCourseApplications", function (req, res, next) {
    courseService.getCourseByQuery(
      "degreeCourseID",
      req.params.degreeCourseID,
      function (err, result) {
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(500).json({ Error: err });
        }
      }
    );
  });

/* POST */

router.post(
  "/",
  utils.isAuthenticated,
  utils.isAdmin,
  function (req, res, next) {
    courseService.findCourseByID(req.body._id, function (err, course) {
      if (course) res.status(400).json({ Error: "User allready exists." });
      else {
        courseService.createCourse(req.body, function (err, createdCourse) {
          if (err) res.status(500).json(err);
          else res.json(createdCourse);
        });
      }
    });
  }
);

router.post(
  "/",
  utils.isAuthenticated,
  utils.isAdmin,
  function (req, res, next) {
    dgService.findDegreeBy(req.body.id, function (err, degree) {
      if (degree) {
        res.status(400).json({ Error: "Already existing" });
      } else {
        dgService.createDegree(req.body, function (err, answer) {
          if (err) {
            res.status(500).json(err);
          } else {
            res.json(answer);
          }
        });
      }
    });
  }
);

/* PUT */

router.put(
  "/:course",
  utils.isAuthenticated,
  utils.isAdmin,
  function (req, res, next) {
    courseService.findCourseByID(req.params.course, function (err, course) {
      if (err) res.status(500).json({ Error: err });
      else {
        if (!course)
          res.status(400).json({ Error: "No course could be found." });
        else {
          courseService.updateCourse(
            req.params.course,
            req.body,
            function (err, updatedCourse) {
              if (err) res.status(500).json({ Error: err });
              else res.status(200).send(updatedCourse);
            }
          );
        }
      }
    });
  }
);

/* DELETE */

router.delete(
  "/:course",
  utils.isAuthenticated,
  utils.isAdmin,
  function (req, res, next) {
    courseService.findCourseByID(req.params.course, function (err, course) {
      if (err) res.status(500).json({ Error: err });
      else {
        if (!course) {
          res.status(400).json({ Error: "No course could be found." });
        } else {
          courseService.deleteCourse(
            req.params.course,
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
