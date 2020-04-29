var permissionDB = require('../models/permission');

exports.create = (req,res) => {
    query = req.body;
    var data = {
        role: query.role,
        method: query.method,
        path: query.path,
    }

    permissionDB.create(data, (err,data)=>{
        if(err){
            return res.status(406).send({status:406,message:err.message})
        } else {
            return res.status(200).send({status: 200, data: data, message:"Tạo thành công"})
        }
    })
    
}

exports.getPermission = (user,req,cb) => {
    console.log(req.originalUrl)
    var data = {
        role: user.role,
        method: req.method,
        path: req.originalUrl,
    }

    permissionDB.getPermission(data, (err,data)=>{
        if(err){
            return cb({err:err,data:null})
        } else {
            return cb({err:null,data:data})
        }
    })
    
}