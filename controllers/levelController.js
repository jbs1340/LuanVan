var userDB = require('../models/user')

exports.checkLevel = user => {
    console.log(user)
    var currentLevel = parseInt(user.level) || 1
    var nextLevel = 0;
    if (currentLevel == 1) {
        if (user.experience >= 100) {
            nextLevel++
        }
    } else if (currentLevel > 1 && currentLevel < 10) {
        if (user.experience >= calLevel(currentLevel, 2, 100)) {
            nextLevel++
        }
    } else if (currentLevel >= 10 && currentLevel < 20) {
        if (user.experience >= calLevel(currentLevel, 2, 200)) {
            nextLevel++
        }
    } else if (currentLevel >= 20 && currentLevel < 30) {
        if (user.experience >= calLevel(currentLevel, 3, 300)) {
            nextLevel++
        }
    }

    if (nextLevel > 0) {
        userDB.updateUser({ _id: user._id }, user, (err, usr) => {

        })
    }
}

calLevel = (level, point, basic) => {
    var experienceNeeded = parseInt(level * basic) / point
    return experienceNeeded
}