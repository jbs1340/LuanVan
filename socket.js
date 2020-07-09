const jwt = require('jsonwebtoken');
var UserDB = require("./models/user");
var ChatroomDB = require("./models/chatroom");
var MessageDB = require("./models/message");
var likeDB = require('./models/like')
var moment = require('moment')

require('dotenv').config();
exports.socketio = function(socket) {
    socket.on("client-login", (data) => {
        console.log(data)
        var verify = jwt.verify(data.token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                console.log(err)
                socket.emit("   ", err.message);
            }
            if (user)
                UserDB.getFromId(user._id, (err, u) => {
                    if (!u) socket.emit("Change-socketid-failed", { message: "failed" });
                    if (!err && u) {
                        socket.emit("is-sucessfully", { message: "OK" });
                        socket.currentUser = u._id
                    }
                })

        });
    })

    socket.on('Chat', (data) => {
        var roomID = data.roomID || ""
        console.log("a", roomID)
        ChatroomDB.findById(roomID, (err, room) => {
            if (err)
                socket.broadcast.emit("message-error", { message: err.message, status: "failed" })
            if (!room) {
                socket.broadcast.emit("message-error", { message: "NOT_FOUND", status: "failed" })
            } else {
                socket.roomID = roomID
                socket.join(roomID)
            }
            console.log("room", socket.roomID)
        })
        console.log('cur', socket.currentUser)
    })

    socket.on("mess", (data) => {
        socket.to(socket.roomID).emit('mess', data)
        var message = {
            createdTime: moment().format(),
            message: data.content | "",
            img: data.img | "",
            userID: socket.currentUser,
            roomID: socket.roomID,
            read: [{ "_id": socket.currentUser }]
        }
        MessageDB.create(message, (err, mess) => {
            if (err) socket.emit("message-error", { message: err.message, status: "failed" })
        })
        ChatroomDB.update_time(socket.roomID)
    })
    socket.on("Client-disconnect", function() {
        socket.disconnect(true);
        console.log(socket.adapter.rooms, socket.id);
    });

    socket.on("like", (data) => {
        var userId = data._id || ""
        var userName = data.name || ""
        var userAva = data.avatar || ""
        var postId = data.postID || ""

        if (userId == "" || userName == "" || userAva == "" || postId == "") {
            socket.emit("message-error", { message: "Can not action like", status: failed })
        } else {
            var req = {
                userID: userId,
                name: userName,
                avatar: userAva,
                postID: postId,
                createdTime: moment().format()
            }
            likeDB.like(data, (err, like) => {
                if (err) {
                    socket.emit("message-error", { message: err.message, status: "failed" })
                } else if (!err && like) {
                    socket.emit("message-error", { message: "", status: "OK" })
                }
            })
        }
    })

    socket.on("connection", mess => {
        console.log("OK!")
        console.log(mess)
    })
}