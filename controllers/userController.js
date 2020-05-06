var userDB = require('../models/user')
var moment = require('moment')

exports.me = (req,res)=>{
    var currentUser = req.currentUser
    console.log(req.currentUser)
    userDB.getFromId(currentUser,(err,user)=>{
      if(user)
        return res.status(200).send({status: 200, message:"Query successfully", data: user})
      return res.status(400).send({status: 400, message:"ERROR!", data: []})
    }) 
}

exports.getUsersAny = (req,res)=>{
  var username = req.query.username || ""
  var limit = parseInt(req.query.limit) || 1;
  var offset = parseInt(req.query.offset) || 0;
  var query = {
    username : {$regex: username+'.*'}
  }
  userDB.findAny(query,limit,offset,(err, user)=>{
    if(err) 
    return res.status(500).send({status: 500, message:err.message})      
    if(user.length > 0){
      var dataUser = []
      user.forEach(u => {
        var newUser = {}
        newUser.name = u.name || "Người dùng YUH"
        newUser.username = u.username
        newUser.role = u.role
        newUser._id=u._id
        newUser.avatar = u.avatar
        newUser.position = newUser.position
        dataUser.push(newUser)
      });
      return res.status(200).send({status: 200, message:"Query successfully", data: dataUser})
    }
    else
    return res.status(404).send({status: 404, message:"NOT FOUND", data: []})
  })
}

exports.getUsersAll = (req,res)=>{
  var limit = parseInt(req.query.limit) || 1;
  var offset = parseInt(req.query.offset) || 0;
  var query = {
  }
  userDB.findAny(query,limit,offset,(err, user)=>{
    if(err) 
    return res.status(500).send({status: 500, message:err.message})      
    if(user.length > 0){
      var dataUser = []
      user.forEach(u => {
        var newUser = {}
        newUser.name = u.name || "Người dùng YUH"
        newUser.username = u.username
        newUser.role = u.role
        newUser._id=u._id
        newUser.avatar = u.avatar
        newUser.position = newUser.position
        dataUser.push(newUser)
      });
      return res.status(200).send({status: 200, message:"Query successfully", data: dataUser})
    }
    else
    return res.status(404).send({status: 404, message:"NOT FOUND", data: []})
  })
}