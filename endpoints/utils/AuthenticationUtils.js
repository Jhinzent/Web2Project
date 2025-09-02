const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

function isAuthenticated(req, res, next) {
  if (typeof req.headers.authorization == "undefined")
    res.status(401).json({ Error: "Could not find authentication header." });
  else {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      config.get("session.tokenKey"),
      { algorithm: "HS256" },
      function (err, user) {
        if (err) res.status(401).json({ Error: "Not authorized." });
        else return next();
      }
    );
  }
}

function createID() {
  return new mongoose.Types.ObjectId().valueOf();
}

function isAdmin(req, res, next) {
  if (
    JSON.parse(
      Buffer.from(
        req.headers.authorization.split(" ")[1].split(".")[1],
        "base64"
      ).toString("ascii")
    )["isAdministrator"] === true
  )
    return next();
  else
    return res
      .status(405)
      .json({ Error: "You do not have the access this resource." });
}

function isAdminBool(req) {
  if (
    JSON.parse(
      Buffer.from(
        req.headers.authorization.split(" ")[1].split(".")[1],
        "base64"
      ).toString("ascii")
    )["isAdministrator"] === true
  )
    return true;
  else return false;
}

module.exports = {
  isAuthenticated,
  isAdmin,
  isAdminBool,
  createID,
};
