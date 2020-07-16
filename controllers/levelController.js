var userDB = require('../models/user')
var marketDB = require('../models/market')
var hubController = require('./hubController')
var socket = require('../socket')

exports.checkLevel = user => {
    var currentLevel = parseInt(user.level) || 1
    var nextLevel = parseInt(currentLevel + 1);
    if (currentLevel == 1) {
        if (user.experience >= 100) {
            currentLevel++
            user.level = currentLevel
            user.power = calPower(currentLevel, 10, 500)
        }
    } else if (currentLevel > 1 && currentLevel < 10) {
        if (user.experience >= calLevel(nextLevel, 2, 100)) {
            currentLevel++
            user.level = currentLevel
            user.power = calPower(currentLevel, 10, 1000)
        }
    } else if (currentLevel >= 10 && currentLevel < 20) {
        if (user.experience >= calLevel(nextLevel, 2, 200)) {
            currentLevel++
            user.level = currentLevel
            user.power = calPower(currentLevel, 10, 2000)
        }
    } else if (currentLevel >= 20 && currentLevel < 30) {
        if (user.experience >= calLevel(nextLevel, 3, 300)) {
            currentLevel++
            user.level = currentLevel
            user.power = calPower(currentLevel, 10, 3500)
        }
    }

    if (currentLevel == nextLevel) {
        userDB.updateUser({ _id: user._id }, user, (err, usr) => {
            socket.socketio = (socket) => {
                socket.emit(usr._id + "_notify", {})
            }
        })
        var query = {
            requirementLevel: user.level,
            isReward: true
        }
        marketDB.all(query, (err, items) => {
            if (items.length > 0) {
                items.forEach(item => {
                    hubController.add(item, user)
                })
            }
        })
    }
}

calLevel = (level, point, basic) => {
    var experienceNeeded = Math.round(parseInt(level * basic) / point)
    return experienceNeeded
}
calPower = (level, point, basic) => {
    var power = Math.round(parseInt(level * basic) / point)
    return power
}