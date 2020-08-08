var permissionDB = require('../models/permission');
var userDB = require('../models/user');

exports.create = (req, res) => {
    query = req.body;
    var data = {
        role: query.role || "",
        method: query.method || "",
        path: query.path || "",
    }

    permissionDB.create(data, (err, data) => {
        if (err) {
            return res.status(406).send({ status: 406, message: err.message })
        } else {
            return res.status(200).send({ status: 200, data: data, message: "Tạo thành công" })
        }
    })

}

exports.getPermission = (userReq, req, cb) => {
    console.log(userReq)
    userDB.getFromId(userReq._id, (err, user) => {
        if (err)
            return cb(err)
        if (user) {
            var url = req.originalUrl.split("?")
            var data = {
                role: user.role,
                method: req.method,
                path: url[0],
            }
            permissionDB.getPermission(data, (err, permiss) => {
                if (permiss != null) {
                    return cb(null, permiss)
                } else return cb({ message: "User này không có quyền thực hiện", code: 500 }, permiss)
            })
        } else {
            var err = {}
            err.message = "Không tim thấy user"
            return cb(err)
        }


    })

}