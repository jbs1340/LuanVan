var hubDB = require('../models/hub')
var moment = require('moment')

exports.get = (req, res) => {
    var limit = parseInt(req.query.limit) || 1
    var offset = parseInt(req.query.offset) || 0
    var reverse = (String(req.query.reverse) == "true")
}


exports.add = (item, user) => {
    var data = {
        itemCode: item.code,
        user: user,
        createdTime: moment().format(),
        level: user.level,
        isUsed: false,
        name: item.name,
        img: item.img
    }

    hubDB.create(data, (err, hub) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (hub) {
            return res.status(200).send({ status: 200, message: "Created successfully", data: hub })
        } else {
            return res.status(400).send({ status: 400, message: "Cannot create", data: [] })
        }
    })
}

exports.getAllSortByLevel = (req, res) => {
    var limit = parseInt(req.query.limit) || 1
    var offset = parseInt(req.query.offset) || 0

    hubDB.getAllSortByLevel(limit, offset, (err, hub) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (hub) {
            return res.status(200).send({ status: 200, message: "Created successfully", data: hub })
        } else {
            return res.status(400).send({ status: 400, message: "Cannot get objects", data: [] })
        }
    })
}

exports.use = (req, res) => {
    var itemCode = req.query.itemCode || ""
    if (itemCode == "") {
        return res.status(400).send({ status: 400, message: "Input invaild" })
    }

    var query = {
        itemCode: itemCode
    }

    hubDB.updateAny(query, { isUsed: true }, (err, item) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (item) {
            item.isUsed = true
            return res.status(200).send({ status: 200, message: "Created successfully", data: item })
        } else {
            return res.status(400).send({ status: 400, message: "Cannot update object", data: [] })
        }
    })
}