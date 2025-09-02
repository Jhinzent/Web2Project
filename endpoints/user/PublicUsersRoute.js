const express = require('express')
const router = express.Router()
const userService = require("./UserService")

/* GET */

router.get('/', (req, res, next) => {
    userService.getUsers(function(err, result) {
        if (err) res.status(500).json({ "Error": err })
        else {
            if(result) res.status(200).json(result)
            else res.status(404).json({ "Error": "No users could be found." })
        }
    })
}).get('/admin', (req, res, next) => {
    userService.findUserByID("admin", function (err, admin) {
        if (err) res.status(500).json({ "Error": err })
        else {
            if(admin) res.status(200).json(admin)
            else res.status(404).json({ "Error": "No admin-user could be found." })
        }
    })
}).get('/:id', (req, res, next) => {
    userService.findUserByID(req.params.id, function (err, admin) {
        if (err) res.status(500).json({ "Error": err })
        else {
            if(admin) res.status(200).json(admin)
            else res.status(404).json({ "Error": "No user could be found." })
        }
    })
})

/* POST */

router.post("/", function (req, res, next) {
    userService.findUserByID(req.body.userID, function (err, user) {
        if (err) res.status(500).json({ "Error": err })
        else {
            if(user) res.status(400).send({ "Error": "User allready exists." })
            else {
                userService.createUser(req.body, function (err, createdUser) {
                    if (err) res.status(500).json({ "Error": err })
                    else res.status(201).json(createdUser)
                })
            }
        }
    })
})

/* PUT */

router.put("/:user", function(req, res, next) {
    userService.findUserByID(req.params.user, function(err, user) {
        if (err) res.status(500).json({ "Error": err })
        else {
            if(!user) res.status(400).json({ "Error": "No user could be found." })
            else {
                userService.updateUser(req.params.user, req.body, function(err, updatedUser) {
                    if (err) res.status(500).json({ "Error": err })
                    else res.status(200).send(updatedUser)
                })
            }
        }
    })
})

/* DELETE */

router.delete("/:user", function(req, res, next) {
    userService.findUserByID(req.params.user, function(err, user) {
        if (err) res.status(500).json({ "Error": err })
        else {
            if(!user) {
                res.status(400).json({ "Error": "No user could be found." })
            }
            else {
                userService.deleteUser(req.params.user, function(err, deletedUser) {
                    if (err) res.status(500).json({ "Error": err })
                    else res.status(204).send()
                })
            }
        }
    })
})

module.exports = router