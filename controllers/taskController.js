var moment = require('moment')
var userDB = require('../models/user')
var projectDB = require('../models/project')
var taskDB = require('../models/task')
var levelController = require('./levelController')

exports.create = (req, res) => {
    var currentUser = req.currentUser
    var query = req.body
    var data = {
        description: query.description || "",
        title: query.title || "",
        takenBy: query.takenBy || "",
        status: query.status || "",
        deadline: query.deadline || "",
        difficulty: parseInt(query.difficulty) || 0,
        expr: parseInt(query.expr) || 0,
        coin: parseInt(query.coin) || 0,
        createdTime: moment().format(),
        projectID: query.projectID || "",
        creatorID: currentUser._id,
        completedTime: null
    }
    if (data.takenBy.length == undefined || data.takenBy == "") {
        return res.status(400).send({ status: 400, message: "takenBy must be Array" })
    }
    if (data.status == "" || data.deadline == "" || data.projectID == "") {
        return res.status(400).send({ status: 400, message: "Input invalid" })
    }

    taskDB.create(data, (err, task) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (task) {
            return res.status(200).send({ status: 200, message: "Created successfully", data: task })
        } else {
            return res.status(400).send({ status: 400, message: "Cannot create", data: [] })
        }
    })
}

exports.getListTaskByProject = (req, res) => {
    var limit = parseInt(req.query.limit) || 1
    var offset = parseInt(req.query.offset) || 0
    var projectID = req.query.projectID || ""
    var query = {
        projectID: projectID,
    }
    if (projectID == "")
        return res.status(400).send({ status: 400, message: "Input invalid" })
    taskDB.getTasksBy(query, limit, offset).then(task => {
        if (task.length > 0) {
            return res.status(200).send({ status: 200, message: "Query successfully", data: task })
        } else {
            return res.status(404).send({ status: 404, message: "NOT_FOUND", data: [] })
        }
    }).catch(err => res.status(500).send({ status: 500, message: err.message }))
}

exports.getTaskByID = (req, res) => {
    var taskID = req.query.id
    taskDB.getTaskByID(taskID, (err, task) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (task) {
            return res.status(200).send({ status: 200, message: "Created successfully", data: task })
        } else {
            return res.status(404).send({ status: 404, message: "NOT_FOUND", data: [] })
        }
    })
}

exports.addMembers = (req, res) => {
    var query = req.body
    var taskID = req.query.taskID || ""
    if (query.takenBy == undefined) {
        return res.status(400).send({ status: 400, message: "Input invalid, takenBy is always Array" })
    }
    if (query.takenBy.length == undefined) {
        return res.status(400).send({ status: 400, message: "Input invalid, takenBy is always Array" })
    }
    if (taskID == "")
        return res.status(400).send({ status: 400, message: "Input invalid" })

    taskDB.getTaskByID(taskID, (err, task) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        var members = task.takenBy
        query.takenBy.forEach(mem => {
            members.push(mem)
        });

        var dataUpdate = {
            takenBy: members
        }
        taskDB.updateMembers(taskID, dataUpdate, (err, mems) => {
            if (err)
                return res.status(500).send({ status: 500, message: err.message })
            if (mems) {
                mems.takenBy = members
                return res.status(200).send({ status: 200, message: "Query successfully", data: mems })
            }
        })
    })
}

exports.removeMembers = (req, res) => {
    var query = req.body
    var taskID = req.query.taskID || ""
    if (query.takenBy.length == undefined || query.takenBy == undefined) {
        return res.status(400).send({ status: 400, message: "Input invalid, takenBy is always Array" })
    }
    if (taskID == "")
        return res.status(400).send({ status: 400, message: "Input invalid" })
    var dataUpdate = {
        takenBy: query.takenBy
    }
    taskDB.updateMembers(taskID, dataUpdate, (err, task) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (task) {
            task.takenBy = query.takenBy
            return res.status(200).send({ status: 200, message: "Query successfully", data: task })
        } else {
            return res.status(400).send({ status: 400, message: "INVALID" })
        }
    })
}

exports.done = (req, res) => {
    var taskID = req.query.taskID
    var out = false
    var msg = ""
    taskDB.getTaskByID(taskID, (err, task) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (task) {
            if (task.status == "COMPLETED") {
                out = true
                msg = "Task đã kết thúc"
                return res.status(400).send({ status: 400, message: msg })
            } else {
                taskDB.done(taskID, (err, task) => {
                    if (err)
                        return res.status(500).send({ status: 500, message: err.message })
                    if (task) {
                        var isOK = true
                        var mess = ''
                        var listUserID = []
                        for (const user of task.takenBy) {
                            listUserID.push(user._id)
                        }
                        var query = {
                            _id: { $in: listUserID }
                        }
                        userDB.findAny(query, listUserID.length, 0, async(err, usr) => {
                            if (err) {
                                isOK = false
                                return res.status(500).send({ status: 500, message: err.message })
                            }
                            if (usr) {
                                var bonusCoin = parseInt(task.coin)
                                var bonusExpr = parseInt(task.expr)
                                var difficulty = parseInt(task.difficulty)
                                var deadline = task.deadline
                                var now = moment().format()
                                for (const u of usr) {
                                    if (moment(now).isBefore(deadline)) {
                                        var curCoin = parseInt(u.coin)
                                        var curExperience = parseInt(u.experience)
                                        curCoin += bonusCoin
                                        curExperience += bonusExpr * difficulty
                                        userDB.updateUser(u._id, { coin: curCoin, experience: curExperience }, (err, newUser) => {
                                            if (err)
                                                return res.status(500).send({ status: 500, message: err.message })
                                            levelController.checkLevel(newUser)
                                        })
                                    } else {
                                        var curHappy = parseInt(u.happy)
                                        curHappy -= 5;
                                        userDB.updateUser(u._id, { happy: curHappy }, (err, newUser) => {
                                            if (err)
                                                res.status(500).send({ status: 500, message: err.message })
                                        })
                                    }
                                }
                            }
                        })
                        return res.status(200).send({ status: 200, message: "Query successfully", data: task })
                    } else {
                        return res.status(400).send({ status: 400, message: "INVALID" })
                    }
                })
            }
        } else {
            msg = "INPUT INVALID"
            return res.status(400).send({ status: 400, message: msg })
        }
    })


}

exports.updateStatus = (req, res) => {
    var taskID = req.query.taskID || ""
    var status = req.body.status || ""
    if (status == "" || status == "COMPLETED") {
        return res.status(400).send({ status: 400, message: "INPUT INVALID" })
    }
    taskDB.updateStatus(taskID, { status: status }, (err, task) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (task) {
            task.status = status
            return res.status(200).send({ status: 200, message: "Query successfully", data: task })
        } else {
            return res.status(400).send({ status: 400, message: "INVALID" })
        }
    })
}

exports.filter_by_date = (req, res) => {
    var date = req.query.date || ""
    var limit = parseInt(req.query.limit) || 1
    var offset = parseInt(req.query.offset) || 0

    if (date == "") {
        return res.status(400).send({ status: 400, message: "INPUT INVALID" })
    }

    var start_date = date + "T00:00:00.000+00:00"
    var end_date = date + "T23:59:59.000+00:00"

    var query = {
        "deadline": { "$lte": end_date },
        "creator._id": currentUser._id
    }

    taskDB.getTasksBy(query, limit, offset, (err, tasks) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (tasks.length > 0) {
            return res.status(200).send({ status: 200, message: "Query successfully", data: tasks })
        } else {
            return res.status(400).send({ status: 404, message: "NOT_FOUND", data: [] })
        }
    })
}