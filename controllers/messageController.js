var moment = require('moment')
var messageDB = require('../models/message')

exports.getMessByIDRoom = (req,res)=>{
    var idRoom = req.query.idRoom || ""
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    var query = {
        roomID: idRoom
    }
    messageDB.get(query,limit,offset,(err,mess)=>{
        if(err)
            return res.status(500).send({status: 500, message: err.message})
        if(mess.length > 0){
            return res.status(200).send({status: 200, message:"Query successfully", data: mess})
        } else {
            return res.status(404).send({status: 404, message:"NOT FOUND", data: mess})
        }
    })
}