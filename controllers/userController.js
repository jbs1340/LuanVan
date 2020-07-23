var userDB = require('../models/user')
var moment = require('moment')

exports.me = (req, res) => {
    var currentUser = req.currentUser

    userDB.getFromId(currentUser, (err, user) => {
        if (user)
            return res.status(200).send({ status: 200, message: "Query successfully", data: user })
        return res.status(400).send({ status: 400, message: "ERROR!", data: [] })
    })
}

exports.getUsersAnyByUsername = (req, res) => {
    var username = req.query.username || ""
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    var query = {
        username: { $regex: username + '.*' }
    }
    userDB.findAny(query, limit, offset, (err, user) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (user.length > 0) {
            var dataUser = []
            user.forEach(u => {
                var newUser = u
                newUser.password = ""
                newUser.address = ""
                dataUser.push(newUser)
            });
            return res.status(200).send({ status: 200, message: "Query successfully", data: dataUser })
        } else
            return res.status(404).send({ status: 404, message: "NOT FOUND", data: [] })
    })
}

exports.getUsersAny = (req, res) => {
    var query = req.query.q || {}
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    var q = JSON.parse(query)
    userDB.findAny(q, limit, offset, (err, user) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (user.length > 0) {
            var dataUser = []
            user.forEach(u => {
                var newUser = u
                newUser.password = ""
                newUser.address = ""
                dataUser.push(newUser)
            });
            return res.status(200).send({ status: 200, message: "Query successfully", data: dataUser })
        } else
            return res.status(404).send({ status: 404, message: "NOT FOUND", data: [] })
    })
}

exports.getUsersAll = (req, res) => {
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    var query = {}
    userDB.findAny(query, limit, offset, (err, user) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (user.length > 0) {
            var dataUser = []
            user.forEach(u => {
                var newUser = u
                newUser.password = ""
                newUser.address = ""
                dataUser.push(newUser)
            });
            return res.status(200).send({ status: 200, message: "Query successfully", data: dataUser })
        } else
            return res.status(404).send({ status: 404, message: "NOT FOUND", data: [] })
    })
}