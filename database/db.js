const assert = require("assert")
var mongoose = require("mongoose")
const config = require("config")


let _db;

const connectionString = config.get("db.connectionString")


function initDb(callback) {
    if (_db) {
        if(callback){
            return callback(null, _db);
        }
        else{
            return _db
        }
    } 
    else{
        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true})
        _db = mongoose.connection

        _db.on("error", console.error.bind(console, "connections error:"))
        _db.once("open", function () {
            console.log("Connected to databse " + connectionString + " in DB.js: " + _db)
            callback(null, _db)
        })
    }
}

module.exports = {
    initDb
};
