var mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    userID: mongoose.Schema.ObjectId,
    name: String,
    avatar: String,
    postID: String,
    content: String,
    createdTime: String
})

var commentModel = mongoose.model("Comment",commentSchema)

exports.create = (data,cb)=>{
        commentModel.create(data).then(cmt =>{
            cb(null,cmt)
        }).catch(err =>{
            cb(err)
        })
}

exports.getCommentsByCurrentPost = async (data,cb)=>{
    try{
        var comment = commentModel.find(data).limit(10).skip(0)
        return comment
    }catch(err){
        return err
    }
}

exports.getComments = (data,limit,offset,cb)=>{
    commentModel.find(data).limit(limit).skip(offset).then(cmt=>{
        cb(null,cmt)
    }).catch(err=>{
        cb(err)
    })
}