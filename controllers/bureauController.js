var BureauDB = require("../models/bureau")
var moment = require('moment')
const { query } = require("express")

exports.create = (req, res) => {
    var query = req.body
    var data = {
        members: query.member || [],
        chef: query.chef || "",
        name: query.name || "",
        totalPower: 0,
        warehouse: [{}],
        rank: 0,
        createdTime: moment().format()
    }
    var msg = ''

    if (data.member.length == 0 || data.chef == "") {
        return res.status(500).send({ message: "Thiếu thông tin" });
    }

    BureauDB.getFromName(data.name, (err, data) => {
        if (err != null) msg = "Lỗi không xác định, không tạo được phòng ban";
        if (data != null) {
            msg = "Tên phòng ban đã được đăng ký";
        }
        if (msg == '') {
            BureauDB.create(data, (err, data) => {
                if (err) {
                    var message = msg != null ? msg : err != null ? err.message : null
                    return res.status(406).send({ status: 406, message: message })
                } else
                    return res.status(200).send({ status: 200, data: data, message: "Tạo văn phòng ban thành công" })
            })
        } else if (msg != '')
            return res.status(406).send({ status: 406, message: msg })
    })
}

exports.getAny = (req, res) => {
    var limit = parseInt(req.query.limit) || 1
    var offset = parseInt(req.query.offset) || 0
    var q = JSON.parse(req.query.q)

    BureauDB.getAny(q, limit, offset, (err, bureau) => {
        if (err)
            return res.status(400).send({ status: 400, message: err.message })

        if (bureau.length > 0) {
            return res.status(200).send({ status: 200, message: "Query successfully", data: bureau })
        } else {
            return res.status(404).send({ status: 404, message: "Query successfully", data: [] })
        }
    })
}