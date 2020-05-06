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

exports.create = async(data,cb)=>{
    await messageModel.create(data,(err,mess)=>{
        if(err) return cb(err)
        return cb(null,mess)
    })
}

exports.get = async (query,limit,offset,cb)=>{
    messageModel.find(query,(err,mess)=>{
        if(err) return cb(err)
        return cb(null,mess)
    }).limit(limit).skip(offset)
}