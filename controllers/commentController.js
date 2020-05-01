var commentDB = require('../models/comment')
var userDB = require('../models/user')
var moment = require('moment')

exports.create = (req,res) =>{
    var currentUser = req.currentUser
    var query = req.body
    if(!query.content || query.postID){
        return res.status(500).send({status:500, message:"Có lỗi xảy ra"})
    }
    userDB.getFromId(currentUser._id,(err,user)=>{
        if(err){
            return res.status(500).send({status:500, message:err})
        }
        var data ={
            userID: currentUser._id,
            name: user.name,
            avatar: user.avatar,
            postID: query.postID,
            content: query.content,
            createdTime: moment().unix()
        }
        commentDB.create(data,(err,comment)=>{
            if(err)
                return res.status(500).send({status:500, message:err})
            else
                return res.status(200).send({status:500, message:"Đăng thành công",data:comment})
        })
    })

}