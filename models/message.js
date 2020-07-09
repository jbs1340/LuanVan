var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    createdTime: Date,
    message: String,
    img: String,
    userID: String,
    roomID: String,
    read: Array
})

var messageModel = mongoose.model("Messages", messageSchema)

exports.create = (data, cb) => {
    messageModel.create(data, (err, mess) => {
        if (err) return cb(err)
        return cb(null, mess)
    })
}

exports.get = async(query, limit, offset, reverse, cb) => {
    if (!reverse) {
        messageModel.find(query, (err, mess) => {
            if (err) return cb(err)
            return cb(null, mess)
        }).limit(limit).skip(offset)
    } else {
        messageModel.find(query, (err, mess) => {
            if (err) return cb(err)
            return cb(null, mess)
        }).limit(limit).skip(offset).sort({ createdTime: -1 })
    }
}

exports.get_sync = async(query, limit, offset, reverse, ) => {
    try {
        if (!reverse) {
            var message = messageModel.find(query).limit(limit).skip(offset)
            return message
        } else {
            var message = messageModel.find(query).limit(limit).skip(offset).sort({ createdTime: -1 })
            return message
        }
    } catch (err) {
        return err
    }
}