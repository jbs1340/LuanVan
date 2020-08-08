var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var moment = require('moment')

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    name: String,
    age: Number,
    avatar: String,
    gender: String,
    email: String,
    phone: String,
    address: String,
    position: String,
    role: String,
    bureau: String,
    level: Number,
    experience: Number,
    coin: Number,
    happy: Number,
    skill: [],
    power: Number,
    rank: Number,
    mentor: Array,
    trainee: Array,
    createdTime: Date
})
userSchema.index({ username: 1 }, { unique: true })
userSchema.index({ email: 1 })

var UserModel = mongoose.model("User", userSchema);

exports.create = function(userData, cb) {
    bcrypt.hash(userData.password, 10, function(err, hash) {
        if (err) {
            console.log("[UserModel] Failed to encrypt password of " + userData.username);
            return cb(err);
        }
        userData.password = hash;
        UserModel.create(userData, function(err, data) {
            if (err) {
                console.log("[UserModel] Failed to add " + userData.username + " to database.\nError: " + err);
                return cb(err);
            } else {
                return cb(null, data);
            }

        });
    });
}

exports.getFromId = function(id, cb) {
    UserModel.findOne({ _id: id }, function(err, data) {
        if (err) return cb(err);
        return cb(null, data);
    })
}

exports.getFromUsername = function(_username, cb) {
    UserModel.findOne({ username: _username }, function(err, data) {
        if (err) return cb(err);
        return cb(null, data);
    })
}

exports.update = (query, data, cb) => {
    UserModel.updateMany(query, data, (err, user) => {
        if (err) return cb(err)
        return cb(null, user)
    })
}

exports.updateUser = (query, data, cb) => {
    UserModel.findByIdAndUpdate(query, data, (err, user) => {
        if (err) return cb(err)
        UserModel.find({ _id: user._id }, (err, u) => {
            if (err) return cb(err)
            return cb(null, u)
        })
    })
}

exports.findAny = (query, limit, offset, cb) => {
    UserModel.find(query, (err, user) => {
        if (err) return cb(err)
        return cb(null, user)
    }).limit(limit).skip(offset)
}

exports.ranking_all = (limit, offset, cb) => {
    UserModel.find({}, (err, users) => {
        if (err) return cb(err)
        return cb(null, users)
    }).sort({ experience: -1, coin: -1 }).limit(limit).skip(offset)
}

exports.ranking_self = (_id, cb) => {
    UserModel.find({}, (err, users) => {
        if (err) return cb(err)
        return cb(null, users)
    }).sort({ level: -1, experience: -1 })
}