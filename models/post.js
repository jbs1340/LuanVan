var mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    content: String,
    createdTime: String,
    tags: Array,
    hashTags: Array,
    type: String,
    img:Array,
    creator : {_id: mongoose.Schema.ObjectId, name: String, avatar: String},
    isLiked: Boolean
})

var postModel = mongoose.model('Post',postSchema);

exports.create = (postData,cb)=>{
    postModel.create(postData, (err,post)=>{
        if(err) return cb(err)
        return cb(null,post)
    })
}

exports.getPosts = (postData,limit,offset,cb)=>{
    console.log(postData)
    postModel.find(postData,(err,post )=>{
        if(err)
            return cb(err)
        return cb(null,post)
    }).limit(limit).skip(offset)
}