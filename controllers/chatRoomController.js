var ChatroomDB = require("../models/chatroom");
var messageDB = require('../models/message')
var moment = require('moment')

exports.create = (req,res)=>{
    var query = req.body
    var users = query.users || ""
    if (users. length == 0 || users == ""){
        return res.status(400).send({status:400, message:"Input invalid"})
    }
    var data = {
        name: query.name || users[0].name,
        users: users,
        expired: query.expired || null,
        createdTime: moment().format(),
        updatedTime: moment().format(),
        messages: []
    }
    ChatroomDB.create(data,(err,room)=>{
        if(err)
            return res.status(500).send({status:500, message: err.message})
        if(room)
            return res.status(200).send({status:200, message:"Created successfully", data:room})
        else
            return res.status(400).send({status:400, message:"Cannot create"})

    })
}

exports.getMyChatRoom = (req,res)=>{
    var currentUser = req.currentUser
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    var query= {
        "users._id": currentUser._id
    }
    ChatroomDB.find(query,limit,offset,(err,room)=>{
        if(err)
        return res.status(500).send({status:500, message: err.message})
    if(room.length > 0) {
        for(const r of room){
            messageDB.get({roomID: r._id},1,0,true,(err,mess)=>{
                if (err) {
                    return res.status(500).send({status:500, message: err.message})
                }
                r.messages = mess
            })
            return res.status(200).send({status:200, message:"Created successfully", data:room})
        } 
    }
    else
        return res.status(404).send({status:404, message:"NOT FOUND",data:[]})
    })
}