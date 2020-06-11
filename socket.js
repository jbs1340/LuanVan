const jwt = require('jsonwebtoken');
var UserDB = require("./models/user");
var ChatroomDB = require("./models/chatroom");
var MessageDB = require("./models/message");
var moment = require('moment')

require('dotenv').config();
exports.socketio = function (socket){
    socket.on("Client-login", (data)=>{
        var verify = jwt.verify(data, process.env.SECRET_KEY,(err,user)=>{
            if(err){
                console.log(err)
                socket.emit("message-error",err.message); 
            }
            if(user)
            UserDB.getFromId(user._id,(err,u)=>{
                if (!u) socket.emit("Change-socketid-failed");
                if(!err && u) {
                    socket.emit("Change-socketid-sucessfully","OK");
                socket.currentUser = u._id
                }
            }) 

          });
      })

      socket.on('Chat', (data)=>{
        var roomID = data.roomID || ""
        console.log("a",roomID)
        ChatroomDB.findById(roomID,(err,room)=>{
            if(err)
                socket.broadcast.emit("message-error", err.message)
            if(!room){
                socket.broadcast.emit("message-error", "NOT_FOUND")
            } else {
                socket.roomID = roomID
                socket.join(roomID)
            }
            console.log("room",socket.roomID)
        })
        console.log('cur',socket.currentUser)
    })
    socket.on("mess", (data)=>{
        socket.to(socket.roomID).emit('mess', data)
        var message = {
            createdTime: moment().format(),
            message: data| "",
            img: "",
            userID: socket.currentUser,
            roomID: socket.roomID,
            read: [{"_id": socket.currentUser}]
        }
        MessageDB.create(message,(err,mess)=>{
            if(err)  socket.emit("message-error", {message: err.message, status: failed})
        })
        ChatroomDB.update_time(socket.roomID)
      })
      socket.on("Client-disconnect",function(){
        socket.disconnect(true);
        console.log(socket.adapter.rooms, socket.id);            
    });
}