var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

const bureauSchema = mongoose.Schema({
    name: String,
    members: [],
    chef: String,
    totalPower: Number,
    warehouse: Object,
    rank: Number,
    createdTime: Date
})

var BureauModel = mongoose.model("Bureau", bureauSchema);
exports.create = function(bureauData, cb) {
    BureauModel.create(bureauData, function(err, data) {
        if (err) {
            console.log("[BureauModel] Failed to add " + bureauData.username + " to database.\nError: " + err);
            return cb(err);
        } else {
            return cb(null, data);
        }

    });
}

exports.getFromId = function(id, cb) {
    BureauModel.findOne({ _id: id }, function(err, data) {
        if (err) return cb(err);
        cb(null, data);
    })
}

exports.getFromName = function(name, cb) {
    BureauModel.findOne({ name: name }, function(err, data) {
        if (err) return cb(err);
        cb(null, data);
    })
}

exports.getAny = function(query, limit, offset, cb) {
    BureauModel.find(query, function(err, data) {
        if (err) return cb(err);
        cb(null, data);
    }).limit(limit).skip(offset)
}

exports.addMembers = (id, members, cb) => {
    BureauModel.updateOne({ _id: id }, { members: members }, (err, data) => {
        if (err) return cb(err)
        cb(null, data)
    })
}