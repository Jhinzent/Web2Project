const express = require("express");
const router = express.Router();
const userService = require("./UserService");
const utils = require("../utils/AuthenticationUtils");

/* GET */

router
  .get("/", utils.isAuthenticated, utils.isAdmin, function (req, res, next) {
    userService.getUsers(function (err, result) {
      if (err) res.status(500).json({ Error: err });
      else {
        if (result) {
          const filtered = result.map(function (mapping) {
            const { firstName, lastName, userID, isAdministrator } = mapping;
            return { firstName, lastName, userID, isAdministrator };
          });
          res.status(200).json(Object.values(filtered));
        } else res.status(400).json({ Error: "No users could be found." });
      }
    });
  })
  .get(
    "/:id",
    utils.isAuthenticated,
    utils.isAdmin,
    function (req, res, next) {
      userService.findUserByID(req.params.id, function (err, user) {
        if (err) res.status(500).json({ Error: err });
        else {
          if (user) {
            res.status(200).json({
              userID: user.userID,
              firstName: user.firstName,
              lastName: user.lastName,
              isAdministrator: user.isAdministrator,
            });
          } else res.status(404).json({ Error: "No user could be found." });
        }
      });
    }
  );

/* POST */

router.post(
  "/",
  utils.isAuthenticated,
  utils.isAdmin,
  function (req, res, next) {
    var userID = req.body.userID
    if(!userID) userID = req.body.name
    userService.findUserByID(userID, function (err, user) {
      if (err) res.status(500).json({ Error: err });
      else {
        if (user) res.status(400).send({ Error: "User allready exists." });
        else {
          userService.createUser(req.body, function (err, createdUser) {
            if (err) res.status(500).json({ Error: err });
            else
              res.status(201).json({
                userID: createdUser.userID,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                isAdministrator: createdUser.isAdministrator,
              });
          });
        }
      }
    });
  }
);

/* PUT */

router.put(
  "/:user",
  utils.isAuthenticated,
  utils.isAdmin,
  function (req, res, next) {
    userService.findUserByID(req.params.user, function (err, user) {
      if (err) res.status(500).json({ Error: err });
      else {
        if (!user) res.status(400).json({ Error: "No user could be found." });
        else {
          userService.updateUser(
            req.params.user,
            req.body,
            function (err, updatedUser) {
              if (err) res.status(500).json({ Error: err });
              else
                res.status(200).send({
                  userID: updatedUser.userID,
                  firstName: updatedUser.firstName,
                  lastName: updatedUser.lastName,
                  isAdministrator: updatedUser.isAdministrator,
                });
            }
          );
        }
      }
    });
  }
);

/* DELETE */

router.delete(
  "/:user",
  utils.isAuthenticated,
  utils.isAdmin,
  function (req, res, next) {
    userService.findUserByID(req.params.user, function (err, user) {
      if (err) res.status(500).json({ Error: err });
      else {
        if (!user) {
          res.status(400).json({ Error: "No user could be found." });
        } else {
          userService.deleteUser(req.params.user, function (err, deletedUser) {
            if (err) res.status(500).json({ Error: err });
            else res.status(204).send();
          });
        }
      }
    });
  }
);

module.exports = router;
