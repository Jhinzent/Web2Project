const User = require("./UserModel");

function getUsers(callback) {
  User.find(function (err, user) {
    if (err) callback(err, null);
    else callback(null, user);
  });
}

function findUserByID(searchUserID, callback) {
  if (!searchUserID) callback("No userID given.", null);
  else {
    var query = User.findOne({ userID: searchUserID });
    query.exec(function (err, user) {
      if (err) callback(err, null);
      else {
        if (user) {
          var returnUser = {
            "firstName" : user.firstName,
            "lastName" : user.lastName,
            "_id" : user._id,
            "isAdministrator" : user.isAdministrator,
            "userID" : user.userID
          }
          callback(null, returnUser);
        }
        else callback(null, null);
      }
    });
  }
}

function createUser(jsonBody, callback) {
  if (!jsonBody) callback("No jsonBody given.", null);
  if (!jsonBody.userID) callback("No userID given.", null);
  else {
    User.create(jsonBody, function (err, createdUser) {
      if (err) callback(err, null);
      else callback(null, createdUser);
    });
  }
}

function updateUser(searchUserID, updateParams, callback) {
  if (!searchUserID) callback("No userID given.", null);
  else {
    User.findOneAndUpdate(
      { userID: searchUserID },
      updateParams,
      { new:true },
      function (err, res) {
        if (err) callback(err, null);
        else callback(null, res);
      }
    );
  }
}

function deleteUser(searchUserID, callback) {
  if (!searchUserID) callback("No userID given.", null);
  else {
    User.findOneAndDelete({ userID: searchUserID }, function (err, res) {
      if (err) callback(err, null);
      else callback(null, res);
    });
  }
}

module.exports = {
  getUsers,
  findUserByID,
  createUser,
  updateUser,
  deleteUser,
};
