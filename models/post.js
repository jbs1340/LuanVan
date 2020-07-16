var mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    content: String,
    createdTime: Date,
    tags: Array,
    hashTags: Array,
    type: String,
    img: Array,
    creator: { _id: String, name: String, avatar: String },
    isLiked: Boolean,
    comments: Array,
    likesTotal: Number,
    commentsTotal: Number
})

postSchema.index({ type: 1 })
postSchema.index({ isLiked: 1 })
postSchema.index({ "creator._id": 1 })

var postModel = mongoose.model('Post', postSchema);

exports.create = (postData, cb) => {
    postModel.create(postData, (err, post) => {
        if (err) return cb(err)
        return cb(null, post)
    })
}

exports.getPosts = (postData, limit, offset, cb) => {
    console.log(postData)
    postModel.find(postData, (err, post) => {
        if (err)
            return cb(err)
        return cb(null, post)
    }).limit(limit).skip(offset).sort({ createdTime: -1 })
}