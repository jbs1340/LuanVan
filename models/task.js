const mongoose = require('mongoose')
var moment = require('moment')

var taskSchema = mongoose.Schema({
    description: String,
    title: String,
    takenBy: Array,
    status: String,
    deadline: Date,
    difficulty: Number,
    expr: Number,
    coin: Number,
    createdTime: Date,
    projectID: String,
    creatorID: String,
    completedTime: Date
})
taskSchema.index({ creatorID: 1 })
taskSchema.index({ projectID: 1 })
taskSchema.index({ takenBy: 1 })
taskSchema.index({ status: 1 })
var taskModel = mongoose.model("Task", taskSchema)

exports.create = (data, cb) => {
    taskModel.create(data, (err, task) => {
        if (err) return cb(err)
        return cb(null, task)
    })
}

exports.done = (_id, cb) => {
    var completed = moment().format()
    taskModel.findByIdAndUpdate(_id, { status: "COMPLETED", completedTime: completed },
        (err, task) => {
            if (err) return cb(err)
            task.status = "COMPLETED"
            task.completedTime = completed
            return cb(null, task)
        })
}

exports.getTasksBy = async(data, limit, offset, cb) => {
    var task = await taskModel.find(data).limit(limit).skip(offset)
    return task
}

exports.getTaskByID = (_id, cb) => {
    taskModel.findById(_id, (err, task) => {
        if (err) return cb(err)
        return cb(null, task)
    })
}

exports.updateMembers = (_id, data, cb) => {
    taskModel.findByIdAndUpdate(_id, data, (err, task) => {
        if (err) return cb(err)
        return cb(null, task)
    })
}

exports.updateStatus = (_id, data, cb) => {
    taskModel.findByIdAndUpdate(_id, data, (err, task) => {
        if (err) return cb(err)
        return cb(null, task)
    })
}