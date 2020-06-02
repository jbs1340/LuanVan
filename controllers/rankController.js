var userDB = require('../models/user')
var moment = require('moment')

exports.rank_all = (req, res)=>{
    var limit = parseInt(req.query.limit) || 0;
    var offset = parseInt(req.query.offset) || 0;

    userDB.ranking_all(limit,offset,(err,users)=>{
        if(err)
            return res.status(500).send({status:500, message: err})
        return res.status(200).send({status:200, message: "Query successfully", data: users})
    })
}

exports.rank_self = (req,res)=>{
    var currentUser = req.currentUser
    userDB.ranking_self(currentUser._id,(err,users)=>{
        if(err)
            return res.status(500).send({status:500, message: err})
        return res.status(200).send({status:500, message: "Query successfully", data: users})
    })
}