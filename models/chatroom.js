var mongoose = require('mongoose');
var moment = require('moment')

var chatroomSchema = mongoose.Schema({
    name: String,
    users: Array,
    expired: Date,
    createdTime: Date,
    updatedTime: Date,
    messages: Array
})

var chatroomModel = mongoose.model("Chatroom", chatroomSchema)

exports.create = async(data, cb) => {
    chatroomModel.create(data, (err, room) => {
        if (err) return cb(err)
        return cb(null, room)
    })
}

exports.findById = (_id, cb) => {
    chatroomModel.findById(_id, (err, room) => {
        if (err) return cb(err)
        return cb(err, room)
    })
}

exports.find = (query, limit, offset, cb) => {
    chatroomModel.find(query, (err, room) => {
        if (err) return cb(err)
        return cb(err, room)
    }).limit(limit).skip(offset).sort({ updatedTime: -1 })
}

exports.update_time = (idRoom, cb) => {
    chatroomModel.updateOne({ _id: idRoom }, { updatedTime: moment().format() })
}