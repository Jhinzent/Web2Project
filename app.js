var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var https = require("https");

var key = fs.readFileSync("./certificates/key.pem");
var cert = fs.readFileSync("./certificates/cert.pem");

var database = require("./database/db");
var authentication = require("./endpoints/authenticate/AuthenticationRoute");
var userService = require("./endpoints/user/UserService");
var publicUserRoutes = require("./endpoints/user/PublicUsersRoute");
var userRoutes = require("./endpoints/user/userRoute");
var courses = require("./endpoints/degreeCourses/DegreeCourseRoute");
var courseApplications = require("./endpoints/degreeCourseApplication/DegreeCourseApplicationRoute");
var abnahme = require("./endpoints/abnahme/AbnahmeRoute");

var app = express();
var server = https.createServer({ key: key, cert: cert }, app);
app.get("/", function (req, res) {
  res.send("this is an secure server");
});

app.use(express.json());
app.use(bodyParser.json());

app.use("/api/publicUsers", publicUserRoutes);
app.use("/api/users", userRoutes);
app.use("/api/authenticate", authentication);
app.use("/api/degreeCourses", courses);
app.use("/api/degreeCourseApplications", courseApplications);
app.use("/api/abnahme", abnahme)

/* Start Database */

database.initDb(function (err, db) {
  if (db) {
    console.log("Datenbank  angebunden");
  } else {
    console.log("Datenbank konnte nicht angebunden werden");
  }
});

/* Create Standard Admin */

userService.createUser({
  userID: "admin",
  firstName: "Udo",
  lastName: "Müller",
  password: "123",
  isAdministrator: true,
}, function(err, admin) {
  /* if(err) console.log("Standard admin user could not be created.")
  else console.log("Standard admin user created.") */
})

/* Error Handler */
app.use(function (req, res, next) {
  res.status(404).send("This Url is not supported");
});

app.use(function (req, res, next) {
  res.status(500).send("Something Broke!");
});

/* Change Port */

const port = 443;
server.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`);
});

module.exports = app;
