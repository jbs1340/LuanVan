var relationDB = require('../models/relation')
var userDB = require('../models/user')
var moment = require('moment')

exports.add_mentor = (req, res) => {
    var currentUser = req.currentUser
    var query = req.body
    var mentor = query.mentor || ""

    if (mentor == "") {
        return res.status(500).send({ status: 500, message: "Input invalid." })
    }
    userDB.getFromId(currentUser._id, (err, user) => {
        if (err)
            return res.status(400).send({ status: 400, message: err.message })
        if (user) {
            var data = {
                mentor: mentor,
                trainee: user,
                createdTime: moment().format()
            }
            relationDB.create(data, (err, rela) => {
                if (err)
                    return res.status(400).send({ status: 400, message: err.message })
                if (rela) {
                    user.mentor.push(rela.mentor)
                    userDB.updateUser(currentUser._id, { mentor: user.mentor }, (err, u) => {
                        if (err)
                            return res.status(400).send({ status: 400, message: err.message })
                        if (u) {
                            u.password = null
                            u.mentor = rela.mentor
                            userDB.getFromId(rela.mentor._id, (err, mentor) => {
                                if (err)
                                    return res.status(400).send({ status: 400, message: err.message })
                                if (mentor) {
                                    mentor.trainee.push(data.trainee)
                                    userDB.updateUser(mentor._id, { trainee: mentor.trainee }, (err, newMentor) => {
                                        if (err)
                                            return res.status(400).send({ status: 400, message: err.message })
                                        if (newMentor) {
                                            return res.status(200).send({ status: 200, message: "Add successfully", data: u })
                                        } else {
                                            return res.status(400).send({ status: 400, message: "Không thể cập nhật user" })
                                        }
                                    })
                                } else {
                                    return res.status(404).send({ status: 404, message: "Không thể tìm thấy user" })
                                }
                            })
                        } else {
                            return res.status(400).send({ status: 400, message: "Không thể cập nhật user" })
                        }
                    })
                } else {
                    return res.status(400).send({ status: 400, message: "Yêu cầu thất bại" })
                }
            })
        } else {
            return res.status(404).send({ status: 404, message: "NOT FOUND USER" })
        }
    })
}


exports.add_trainee = (req, res) => {
    var currentUser = req.currentUser
    var query = req.body
    var trainee = query.trainee || ""

    if (trainee == "") {
        return res.status(500).send({ status: 500, message: "Input invalid." })
    }
    userDB.getFromId(currentUser._id, (err, user) => {
        if (err)
            return res.status(400).send({ status: 400, message: err.message })
        if (user) {
            delete user.password
            var data = {
                mentor: user,
                trainee: trainee,
                createdTime: moment().format()
            }
            relationDB.create(data, (err, rela) => {
                if (err)
                    return res.status(400).send({ status: 400, message: err.message })
                if (rela) {
                    user.trainee.push(rela.trainee)
                    userDB.updateUser(currentUser._id, { trainee: user.trainee }, (err, u) => {
                        if (err)
                            return res.status(400).send({ status: 400, message: err.message })
                        if (u) {
                            u.password = null
                            u.trainee = rela.trainee
                            userDB.getFromId(rela.trainee._id, (err, trainee) => {
                                if (err)
                                    return res.status(400).send({ status: 400, message: err.message })
                                if (trainee) {
                                    trainee.mentor.push(data.mentor)
                                    userDB.updateUser(trainee._id, { mentor: trainee.mentor }, (err, newTrainee) => {
                                        if (err)
                                            return res.status(400).send({ status: 400, message: err.message })
                                        if (newTrainee) {
                                            return res.status(200).send({ status: 200, message: "Add successfully", data: u })
                                        } else {
                                            return res.status(400).send({ status: 400, message: "Không thể cập nhật user" })
                                        }
                                    })
                                } else {
                                    return res.status(404).send({ status: 404, message: "Không thể tìm thấy user" })
                                }
                            })
                        } else {
                            return res.status(400).send({ status: 400, message: "Không thể cập nhật user" })
                        }
                    })
                } else {
                    return res.status(400).send({ status: 400, message: "Yêu cầu thất bại" })
                }
            })
        } else {
            return res.status(404).send({ status: 404, message: "NOT FOUND USER" })
        }
    })
}