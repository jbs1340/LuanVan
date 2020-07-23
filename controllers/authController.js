const jwt = require('jsonwebtoken');
const passport = require("passport");
var UserDB = require("../models/user");
var permissionController = require("../controllers/permissionController");
var moment = require('moment')
var bcrypt = require('bcrypt');

require('dotenv').config();

exports.loginUser = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user || info) {
            return res.status(400).send({ status: 400, message: info.message });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(400).send({ status: 400, message: err.message });
            }

            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
                expiresIn: "120h"
            });
            if (user.role == "STAFF" || user.role == "MANAGER")
                return res.status(200).send({ token: token });
            else
                return res.status(400).send({ status: 400, message: "Không thể truy cập" });
        });
    })(req, res);
}

exports.loginAdmin = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user || info) {
            return res.status(400).send({ status: 400, message: info.message });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(400).send({ status: 400, message: err.message });
            }

            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
                expiresIn: "120h"
            });
            if (user.role == "ADMIN")
                return res.status(200).send({ token: token });
            else
                return res.status(400).send({ status: 400, message: "Không thể truy cập" });
        });
    })(req, res);
}

function UserRegisterValidation(data, cb) {
    UserDB.getFromUsername(data.username, function(err, data) {
        if (err) return cb("Lỗi không xác định, vui lòng đăng ký lại!");
        if (data) return cb("Username này đã được đăng ký, vui lòng sử dụng username khác!");
        cb(null);
    });
}

exports.register = (req, res) => {
    var query = req.body
    var data = {
        username: query.username || "",
        password: query.password || "",
        name: query.name || "",
        age: query.age || 0,
        gender: query.gender,
        email: query.email,
        position: query.position,
        role: query.role,
        bureau: query.bureau || null,
        avatar: query.avatar || "https://image.flaticon.com/icons/png/512/2919/2919573.png",
        phone: query.phone || "",
        address: query.address || "",
        level: 1,
        experience: 0,
        coin: 0,
        happy: 200,
        skill: [],
        power: 200,
        rank: 0,
        mentor: [],
        trainee: [],
        createdTime: moment().format()
    };
    var result = {};
    var status = 200;
    if (data.phone == "" || data.address == "" || data.name == "" || data.age < 18) {
        return res.status(400).send({ status: 400, message: "Input invalid, must have phone & address & name & age > 18" })
    }
    UserRegisterValidation(data, function(msg) {
        if (msg == null) {
            UserDB.create(data, function(err, id) {
                if (err) {
                    console.log("[UserController] Failed to add user to database: " + err);
                    status = 500;
                    result.status = status;
                    result.error = "Có lỗi trong quá trình tạo cơ sở dữ liệu, vui lòng thử lại!"
                    res.status(status).send(result);
                } else {
                    console.log("[UserController] Success create user with ID: " + id);
                    status = 200;
                    result.status = status;
                    result.id = id;
                    res.status(status).send(result);
                }
            });
        } else {
            status = 406;
            result.status = status;
            result.error = msg
            res.status(status).send(result);
        }
    })
}
exports.verifyToken = (req, res, next) => {
    var bearerHeader = req.headers.authorization
    if (bearerHeader == undefined) {
        return res.status(500).send({ status: 500, message: "Token không hợp lệ" })
    } else
        var token = bearerHeader.split(" ")
    jwt.verify(token[1], process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(400).send({ status: 400, message: err.message })
        } else {
            permissionController.getPermission(user, req, (err, data) => {
                if (err != null) {
                    return res.status(500).send({ status: 500, message: err.name })
                } else if (data == null) {
                    return res.status(400).send({ status: 400, message: "Người dùng không được phép thực thi" })
                } else if (data) {
                    req.currentUser = user
                    next()
                } else {
                    return res.status(500).send({ status: 500, message: "ERROR" })
                }
            })
        }
    })

}

exports.updateInfo = async(req, res) => {
    var currentUser = req.currentUser
    var data = req.body
    new Promise(resolve => {
        if (data.password != undefined) {
            bcrypt.hash(data.password, 10, (err, pass) => {
                if (err)
                    return res.status(400).send({ status: 400, message: err.message })
                data.password = pass
                resolve(data)
            })
        } else {
            resolve(data)
        }
    }).then(data => {
        UserDB.updateUser(currentUser._id, data, (err, user) => {
            if (err)
                return res.status(400).send({ status: 400, message: err.message })
            if (user) {
                user = data
                return res.status(200).send({ status: 200, message: "Updated successfully", data: user })
            } else {
                return res.status(400).send({ status: 400, message: "Updated failed" })
            }
        })
    })
}