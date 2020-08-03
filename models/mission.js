const mongoose = require('mongoose')

var missionSchema = mongoose.Schema({
    title: String,
    description: String,
    img: String,
    deadline: Date,
    createdTime: Date,
    creator: { _id: String, avatar: String, name: String },
    coin: Number,
    experience: Number,
    type: String,
    target: Array,
    outOfDate: Boolean,
    function: String
})

var missionLogsSchema = mongoose.Schema({
    missionID: String,
    userID: String,
    status: String,
    completedTime: Date
})

missionSchema.index({ "creator._id": 1 })
missionSchema.index({ function: 1 })
missionLogsSchema.index({ missionID: 1 })
missionLogsSchema.index({ userID: 1 })

var missionModel = mongoose.model("Mission", missionSchema)
var missionLogsModel = mongoose.model("Mission_Logs", missionLogsSchema)

exports.create = (data, cb) => {
    missionModel.create(data, (err, mission) => {
        if (err) return cb(err)
        return cb(err, mission)
    })
}

exports.get = (query, limit, offset, cb) => {
    missionModel.find(query, (err, mission) => {
        if (err) return cb(err)
        return cb(err, mission)
    }).limit(limit).skip(offset).sort({ createdTime: -1 })
}

exports.done = (query, cb) => {
    missionLogsModel.create(query, (err, mission) => {
        if (err) return cb(err)
        return cb(err, mission)
    })
}

exports.getLogs = (data, limit, offset, cb) => {
    missionLogsModel.find(data, (err, mission) => {
        if (err) return cb(err)
        return cb(err, mission)
    }).limit(limit).skip(offset)
}