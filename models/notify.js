var mongoose = require('mongoose');

var notifySchema = mongoose.Schema({
    isLike: Boolean,
    isComment: Boolean,
    isTag: Boolean,
    postId: String,
    title: String,
    userAction: { _id: String, name: String, avatar: String },
    isRead: Boolean,
    createdTime: Date,
    targetUser: String
})

notifySchema.index({ isLike: 1 })
notifySchema.index({ isComment: 1 })
notifySchema.index({ isTag: 1 })
notifySchema.index({ postId: 1 })
notifySchema.index({ userAction: 1 })
notifySchema.index({ isRead: 1 })

var notifyModel = mongoose.model("notify", notifySchema)

exports.create = (data, cb) => {
    notifyModel.create(data, (err, notis) => {
        return cb(err, notis)
    })
}

exports.getAny = (query, limit, offset, reverse, cb) => {
    if (!reverse) {
        notifyModel.find(query, (err, notis) => {
            return cb(err, notis)
        }).limit(limit).skip(offset)
    } else {
        notifyModel.find(query, (err, notis) => {
            return cb(err, notis)
        }).limit(limit).skip(offset).sort({ createdTime: -1 })
    }
}