var mongoose = require('mongoose');

var notifySchema = mongoose.Schema({
    _id: mongoose.mongo.ObjectID,
    isLike: Boolean,
    isComment: Boolean,
    isTag: Boolean,
    postId: String,
    title: String,
    userAction: {_id: String, name: String, avatar: String},
    isRead: Boolean,
    createdTime: Date
})

var notifyModel = mongoose.model("Notify",notifySchema)

exports.create = (data,cb)=>{
    notifyModel.create(data,(err,notis)=>{
        return cb(err,notis)
    })
}

exports.getAll = (limit,offset,reverse,cb)=>{
    if (!reverse){
        notifyModel.find({},(err,notis)=>{
            return cb(err,notis)
        }).limit(limit).offset(offset)
    } else {
        notifyModel.find({},(err,notis)=>{
            return cb(err, notis)
        }).limit(limit).offset(offset).sort({createdTime: -1})
    }
}