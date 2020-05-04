var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    createdTime: Date,
    message: String,
    img: String,
    userID: String,
    roomID: String
})

var messageModel = mongoose.model("Messages", messageSchema)

exports.create = async(data)=>{
    return await messageModel.create(data)
}

exports.get = async (query,limit,offset)=>{
    return await messageModel.find(query).limit(limit).skip(offset)
}