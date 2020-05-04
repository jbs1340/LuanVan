var mongoose = require('mongoose');

var chatroomSchema = mongoose.Schema({
    _id:String,
    users: Array,
    expired: Date,
    createdTime: Date
})

var chatroomModel = mongoose.model("Chatroom", chatroomSchema)

exports.create = async(data,cb)=>{
    chatroomModel.create(data,(err,room)=>{
        if(err) return cb(err)
        return cb(null,room)
    })
}

exports.findById = (_id,cb)=>{
    chatroomModel.findById(_id,(err,room)=>{
        if(err) return cb(err)
        return cb(err,room)
    })
}