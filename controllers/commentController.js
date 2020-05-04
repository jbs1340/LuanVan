var commentDB = require('../models/comment')
var userDB = require('../models/user')
var moment = require('moment')

exports.create = (req,res) =>{
    var currentUser = req.currentUser
    var query = req.body
    if(!query.content || !query.postID){
        return res.status(500).send({status:500, message:"Có lỗi xảy ra"})
    }
    userDB.getFromId(currentUser._id,(err,user)=>{
        if(err){
            return res.status(500).send({status:500, message:err.message})
        }
        var data ={
            userID: currentUser._id,
            name: user.name,
            avatar: user.avatar,
            postID: query.postID,
            content: query.content,
            createdTime: moment().format()
        }
        commentDB.create(data,(err,comment)=>{
            if(err)
                return res.status(500).send({status:500, message:err.message})
            else
                return res.status(200).send({status:200, message:"Đăng thành công",data:comment})
        })
    })

}

exports.getComments = (req,res)=>{
    var limit = parseInt(req.query.limit) || 1
    var offset = parseInt(req.query.offset) || 0
    var postID = req.query.postID || ""

    commentDB.getComments({postID: postID},limit,offset,(err,cmt)=>{
        if(err){
            return res.status(500).send({status:500,message:err.message})
        }
        if(cmt.length == 0){
            return res.status(404).send({status:404,message:"Không tìm thấy",data:[]})
        } else {
            return res.status(200).send({status:200,message:"Query successfully",data:cmt})
        }
    })
}