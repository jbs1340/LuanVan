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
