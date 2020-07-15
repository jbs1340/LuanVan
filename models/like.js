var mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    userID: mongoose.Schema.ObjectId,
    name: String,
    avatar: String,
    postID: String,
    createdTime: Date
})
likeSchema.index({ userID: 1 })
likeSchema.index({ postID: 1 })
var likeModel = mongoose.model('Like', likeSchema)

exports.like = (data, cb) => {
    likeModel.create(data, (err, like) => {
        if (err) return cb(err)
        return cb(null, like)
    })
}

exports.getLike = (data, cb) => {
    likeModel.find(data, (err, like) => {
        if (err) return cb(err)
        return cb(null, like)
    })
}

exports.isLiked = async(data) => {
    try {
        var like = await likeModel.findOne(data)
        return like
    } catch (err) {
        return err
    }
    /*await likeModel.findOne(data,(err,like)=>{
        if(err) return cb(err)
        return cb(null,like)
    })*/
}

exports.unLike = (data, cb) => {
    likeModel.deleteMany(data, (err, unLike) => {
        console.log(err, unLike)
        if (err) return cb(err)
        return cb(null, unLike)
    })
}

exports.total = (data, cb) => {
    likeModel.count(data, (err, size) => {
        if (err)
            return cb(err)
        return cb(null, size)
    })
}