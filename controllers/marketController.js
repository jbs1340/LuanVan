var moment = require('moment')
var marketDB = require('../models/market')
var userDB = require('../models/user')

exports.add = (req, res) => {
    var currentUser = req.currentUser
    var query = req.body
    var name = query.name || ""
    var cost = parseInt(query.cost) || 0
    var img = query.img || "https://semantic-ui.com/images/wireframe/white-image.png"
    var quantities = parseInt(query.quantities) || 0
    var level = query.requirementLevel || 0
    var discount = parseInt(query.discount) || 0
    var isReward = (String(query.isReward) == "true")
    if (name == "" || cost <= 0 || quantities <= 0 || discount < 0 || level < 0) {
        return res.status(500).send({ status: 500, message: "Input invalid. Must have field name, cost >= 0, quantities >=0 , requirementLevel >= 0" })
    }

    if (isReward) {
        cost = 0
    }
    var data = {
        name: name,
        cost: cost,
        img: img,
        quantities: quantities,
        createdTime: moment().format(),
        discount: discount,
        creatorID: currentUser._id,
        requirementLevel: level,
        code: "item_" + moment().unix(),
        isReward: isReward
    }

    marketDB.create(data, (err, item) => {
        if (err)
            return res.status(400).send({ status: 400, message: err.message })
        if (item) {
            return res.status(200).send({ status: 200, message: "Created successfully", data: item })
        } else {
            return res.status(400).send({ status: 400, message: "Cannot add this item" })
        }
    })
}

exports.getItem = (req, res) => {
    var query = JSON.parse(req.query.q)
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    marketDB.get(query, limit, offset, (err, items) => {
        if (err)
            return res.status(400).send({ status: 400, message: err.message })
        if (items.length > 0) {
            return res.status(200).send({ status: 200, message: "Created successfully", data: items })
        } else {
            return res.status(404).send({ status: 404, message: "NOT FOUND" })
        }
    })
}

exports.getItemByID = (req, res) => {
    var itemID = req.query.itemID
    marketDB.get({ _id: itemID }, 1, 0, (err, items) => {
        if (err)
            return res.status(400).send({ status: 400, message: err.message })
        if (items.length > 0) {
            return res.status(200).send({ status: 200, message: "Created successfully", data: items })
        } else {
            return res.status(404).send({ status: 404, message: "NOT FOUND" })
        }
    })
}

exports.buy = (req, res) => {
    var body = req.body
    var query = req.query
    var itemID = query.itemID
    var currentUser = req.currentUser
    var quantities = parseInt(body.quantities) || 1

    marketDB.get({ _id: itemID }, 1, 0, (err, items) => {
        if (err)
            return res.status(400).send({ status: 400, message: err.message })
        if (items.length == 1) {
            userDB.getFromId(currentUser._id, (err, user) => {
                if (err)
                    return res.status(400).send({ status: 400, message: err.message })
                if (user) {
                    var total = 0
                    if (items[0].discount == 0) {
                        total = quantities * items[0].cost;
                    } else {
                        total = parseFloat(quantities * items[0].cost - (quantities * items[0].cost) * items[0].discount).toFixed(0);
                    }

                    var itemQuantities = parseInt(items[0].quantities)
                    if (quantities > itemQuantities) {
                        return res.status(400).send({ status: 400, message: "Số lương bạn mua không đủ" })
                    } else if (total > user.coin) {
                        return res.status(400).send({ status: 400, message: "Số tiền bạn không đủ" })
                    } else {
                        itemQuantities -= quantities
                        marketDB.update({ _id: itemID }, { quantities: itemQuantities }, (err, item) => {
                            if (err)
                                return res.status(400).send({ status: 400, message: err.message })
                            if (item) {
                                var curCoin = parseInt(user.coin)
                                curCoin -= total
                                userDB.updateUser(currentUser._id, { coin: curCoin }, (err, u) => {
                                    if (err)
                                        return res.status(400).send({ status: 400, message: err.message })
                                    if (user) {
                                        return res.status(200).send({ status: 200, message: "Mua thành công", data: { coin: curCoin, _id: u._id } })
                                    } else {
                                        return res.status(400).send({ status: 400, message: "Cập nhật tiền thất bại" })
                                    }
                                })
                            }
                        })
                    }

                }
            })
        }
    })
}