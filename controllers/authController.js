const jwt = require('jsonwebtoken');
const passport = require("passport");
var UserDB = require("../models/user");
var permissionController = require("../controllers/permissionController");

require('dotenv').config();

exports.login = (req, res,next) =>{
    passport.authenticate('local', (err, user, info) => {
        console.log(info)
        if (err || !user) {
            return next(err);
        }
       req.login(user, (err) => {
           if (err) {
            return next(err);
           }
           
           // generate a signed son web token with the contents of user object and return it in the response
           const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY, {
            expiresIn: "120h"
          });

           return res.status(200).send({user, token});
        });
    })(req, res, next);
}

function UserRegisterValidation(data, cb) {
    UserDB.getFromUsername(data.username, function (err, data){
        if (err)  return cb("Lỗi không xác định, vui lòng đăng ký lại!");
        if (data) return cb("Username này đã được đăng ký, vui lòng sử dụng username khác!");
        cb(null);
    });
}

exports.register = (req, res) =>{
    console.log(req.params)
    var query = req.body
    var data = {
        username: query.username,
        password: query.password,
        name: query.name,
        age: query.age,
        gender: query.gender,
        email: query.email,
        position: query.position,
        role: query.role,
        bureau: query.bureau,
        avatar: null,
        level: 1,
        experience: 0,
        coin: 0,
        happy: 200,
        skill: [],
        power: 200,
        rank: 0,
        mentor: null,
        trainee: null,
    };
    var result = {};
    var status = 200;
    UserRegisterValidation(data, function (msg) {
        if (msg == null) {
            UserDB.create(data, function (err, id) {
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
    var bearerHeader =  req.headers.authorization
    if (bearerHeader == undefined){
        return res.status(500).send({status: 500, message: "Token không hợp lệ"})
    }
    else
        var token = bearerHeader.split(" ")
    jwt.verify(token[1],process.env.SECRET_KEY,(err,user)=>{
        if(err){
            return res.status(400).send({status: 400, message:err.message})
        }else
        {
            console.log("u",user)
            permissionController.getPermission(user,req,(err,data)=>{
                console.log("a",err,data)
                if(err != null){
                    return res.status(500).send({status: 500, message: err.name})
                } else if(data == null){
                    return res.status(400).send({status: 400, message: "Người dùng không được phép thực thi"})
                } else if(data != null){
                    next()
                } else {
                    return res.status(500).send({status: 500, message: "ERROR"})
                }
            })
        }
    })
    
  }