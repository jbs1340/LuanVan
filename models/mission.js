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
    function: String,
    currentUser: String
})

var missionLogsSchema = mongoose.Schema({
    img: String,
    deadline: Date,
    title: String,
    description: String,
    missionID: String,
    userID: String,
    status: String,
    coin: Number,
    experience: Number,
    completedTime: Date
})

var verifyFunction = mongoose.Schema({
    label: String,
    description: String,
    createdTime: Date
})

missionSchema.index({ "creator._id": 1 })
missionSchema.index({ function: 1 })
missionLogsSchema.index({ missionID: 1 })
missionLogsSchema.index({ userID: 1 })
verifyFunction.index({ label: 1 }, { unique: true })

var missionModel = mongoose.model("Mission", missionSchema)
var missionLogsModel = mongoose.model("Mission_Logs", missionLogsSchema)
var functionModel = mongoose.model("Verify_functions", verifyFunction)

exports.create = (data, cb) => {
    missionModel.create(data, (err, mission) => {
        if (err) return cb(err)
        return cb(err, mission)
    })
}

exports.distinct = (field, query, limit, offset, cb) => {
    missionModel.distinct(field, query, (err, logs) => {
        return cb(err, logs)
    })
}

exports.get = (query, limit, offset, cb) => {
    missionModel.find(query, (err, mission) => {
        if (err) return cb(err)
        return cb(err, mission)
    }).limit(limit).skip(offset).sort({ createdTime: -1 })
}

exports.getNonLimit = (query, cb) => {
    missionModel.find(query, (err, mission) => {
        if (err) return cb(err)
        return cb(err, mission)
    }).sort({ createdTime: -1 })
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

exports.distinctLogs = (field, query, limit, offset, cb) => {
    missionLogsModel.distinct(field, query, (err, logs) => {
        return cb(err, logs)
    })
}

exports.create_function = (data, cb) => {
    functionModel.create(data, (err, func) => {
        if (err) {
            return cb(err)
        } else {
            return cb(null, func)
        }
    })
}

exports.get_funcs = (query, limit, offset, cb) => {
    functionModel.find(query, (err, funcs) => {
        return cb(err, funcs)
    }).limit(limit).skip(offset)
}