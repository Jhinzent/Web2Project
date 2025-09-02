var express = require("express");
var router = express.Router();
var authenticationService = require("./AuthenticationService");

/* GET */

router.get("/", (req, res, next) => {
  authenticationService.createSessionToken(
    req.headers.authorization,
    function (err, token, user) {
      if (token) {
        res.header("Authorization", "Bearer " + token);
        res.status(200).json({ Success: "Token created successfully." });
      }
      else {
        console.log(err)
        res.status(401).json({ Error: "Failed to create token: Authentication failed" });
      }
    }
  );
});

module.exports = router;