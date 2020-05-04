var mongoose = require('mongoose');

const permissionSchema = mongoose.Schema({
    role: String,
    method: String,
    path: String,
})

var permissionModel = mongoose.model("Permission", permissionSchema)

exports.create = (permissionData, cb) =>{
    permissionModel.create(permissionData,(err,data)=>{
        if (err) return cb(err,null)
        else return cb(null,data)
    })
}

exports.getPermission = (data,cb) => {
    permissionModel.findOne(data,(err, permission)=>{
        return cb(err,permission)
    })
}