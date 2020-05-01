var moment = require('moment')
var likeDB = require('../models/like')
var userDB = require('../models/user')

exports.like = (req,res)=>{
    var currentUser = req.currentUser;
    var query = req.body
    userDB.getFromId(currentUser._id,(err, user)=>{
        var data ={
            userID : user._id,
            name : user.name,
            avatar: user.avatar,
            postID: req.query.postID,
            createdTime: moment().format()
        }
        likeDB.like(data,(err,like)=>{
            if(err)
                return res.status(500).send({status:500, message: err.message})
            if(like)
                return res.status(200).send({status:200, message:"Liked", data: like})
        })
    })    

}

exports.unLike = (req,res)=>{
    var currentUser = req.currentUser;
    var data ={
        userID : currentUser._id,
        postID: req.query.postID,
    }
    likeDB.unLike(data,(err,like)=>{
        console.log(err,like)
        if(err)
            return res.status(500).send({status:500, message: err.message})
        if(like)
            return res.status(200).send({status:200, message:"UnLiked", data: like})
    })

}