var permissionDB = require('../models/permission');
var userDB = require('../models/user');

exports.create = (req,res) => {
    query = req.body;
    var data = {
        role: query.role || "",
        position: query.position || "",
        method: query.method || "",
        path: query.path || "",
    }

    permissionDB.create(data, (err,data)=>{
        if(err){
            return res.status(406).send({status:406,message:err.message})
        } else {
            return res.status(200).send({status: 200, data: data, message:"Tạo thành công"})
        }
    })
    
}

exports.getPermission = (userReq,req,cb) => {
    var data = null
    userDB.getFromId(userReq._id,(err,user)=>{
        if(user.role == "ADMIN"){
            data = {
                role: user.role,
                method: req.method,
                path: req.originalUrl,
            }
        } else if(user.role == "USER"){
            data = {
                role: user.role,
                position: user.position,
                method: req.method,
                path: req.originalUrl,
            }
        } else {
            return cb("Người dùng không có quyền thực thi", null);
        }

    permissionDB.getPermission(data, (err,permiss)=>{
        if(err != null){
            return cb(err,null)
        } else if(permiss != null) {
            return cb(null,permiss)
        } else return cb(err,permiss)
    })
})

}