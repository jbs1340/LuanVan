var mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    userID: mongoose.Schema.ObjectId,
    name: String,
    avatar: String,
    postID: String,
    content: String,
    createdTime: Date
})
commentSchema.index({ userID: 1 })
commentSchema.index({ postID: 1 })
var commentModel = mongoose.model("Comment", commentSchema)

exports.create = (data, cb) => {
    commentModel.create(data).then(cmt => {
        cb(null, cmt)
    }).catch(err => {
        cb(err)
    })
}

exports.getCommentsByCurrentPost = async(data, cb) => {
    try {
        var comment = commentModel.find(data).limit(100).skip(0).sort({ createdTime: -1 })
        return comment
    } catch (err) {
        return err
    }
}

exports.getComments = (data, limit, offset, reverse, cb) => {
    if (reverse) {
        commentModel.find(data).sort({ createdTime: -1 }).limit(limit).skip(offset).then(cmt => {
            cb(null, cmt)
        }).catch(err => {
            cb(err)
        })
    } else {
        commentModel.find(data).limit(limit).skip(offset).then(cmt => {
            cb(null, cmt)
        }).catch(err => {
            cb(err)
        })
    }
}

exports.total = (data, cb) => {
    commentModel.count(data, (err, size) => {
        if (err)
            return cb(err)
        return cb(null, size)
    })
}