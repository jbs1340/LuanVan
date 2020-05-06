var mongoose = require('mongoose');

var chatroomSchema = mongoose.Schema({
    name: String,
    users: Array,
    expired: Date,
    createdTime: Date,
    updatedTime: Date
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

exports.find = (query,limit,offset,cb)=>{
    chatroomModel.find(query,(err,room)=>{
        if(err) return cb(err)
        return cb(err,room)
    }).limit(limit).skip(offset)
}