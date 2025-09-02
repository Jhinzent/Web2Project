const userService = require("../user/UserService");
const jwt = require("jsonwebtoken");
const config = require("config");

function createSessionToken(header, callback) {
  if (!header) callback("No authentication header given.", null);
  else {
    const credentials = Buffer.from(header.split(" ")[1], "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");
    userService.findUserByID(username, function (err, user) {
      if (user)
        user.comparePassword(password, function (err, isMatch) {
          if (err) callback(err, null, null);
          else {
            if (!isMatch) callback(err, null, null);
            else {
              const token = createTokenPrivate(user);
              callback(null, token, user);
            }
          }
        });
      else callback("Could not find user matching the authentication header", err);
    });
  }
}

function createTokenPrivate(user) {
  const issuedAt = new Date().getTime();
  const expirationTime = config.get("session.timeout");
  const expiresAt = issuedAt + expirationTime * 1000;
  const privateKey = config.get("session.tokenKey");
  let token = jwt.sign(
    {
      userID: user.userID,
      isAdministrator: user.isAdministrator,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    privateKey,
    {
      expiresIn: expiresAt,
      algorithm: "HS256",
    }
  );
  return token;
}

module.exports = {
    createSessionToken
}
