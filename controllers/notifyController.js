var notifyDB = require('../models/notify')
var moment = require('moment')

exports.create = (req, res) => {
    var query = req.body
    var isLike = query.isLike || false
    var isComment = query.isComment || false
    var isTag = query.isTag || false
    var postId = query.postId || ""
    var userAction = req.currentUser
    var isRead = false
    var createdTime = moment().format()

    if (postId == "") {
        return res.status(400).send({ status: 400, message: "Missing postId", })
    }

    var data = {
        isLike: isLike,
        isComment: isComment,
        isTag: isTag,
        postId: postId,
        title: "",
        userAction: userAction,
        isRead: isRead,
        createdTime: createdTime
    }

    notifyDB.create(data, (err, notify) => {
        if (err)
            return res.status(500).send({ status: 400, message: err.message })

        return res.status(200).send({ status: 200, message: "Created successfully", data: notify })
    })
}

exports.getAny = (req, res) => {
    var query = req.query.q
    var q = JSON.parse(query)
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    var reverse = (String(req.query.reverse) === "true");

    notifyDB.getAny(q, limit, offset, reverse, (err, notify) => {
        if (notify) {
            return res.status(200).send({ status: 200, message: "Query successfully", data: notify })
        } else {
            return res.status(200).send({ status: err ? 400 : 404, message: "Query failed", data: [] })
        }
    })
}

exports.getMyNotifies = (req, res) => {
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    var currentUser = req.currentUser

    notifyDB.getAny({ userAction: currentUser._id }, limit, offset, true, (err, noti) => {
        if (noti) {
            return res.status(200).send({ status: 200, message: "Query successfully", data: noti })
        } else {
            return res.status(200).send({ status: err ? 400 : 404, message: err.message || "Query failed", data: [] })
        }
    })
}