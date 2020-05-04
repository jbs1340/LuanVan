const jwt = require('jsonwebtoken');
var UserDB = require("./models/user");
var ChatroomDB = require("./models/chatroom");
var MessageDB = require("./models/message");
var moment = require('moment')

require('dotenv').config();
exports.socketio = function (socket){
    socket.on("Client-login", async (data)=>{
        var verify = jwt.verify(data, process.env.SECRET_KEY,(err,user)=>{
            console.log("Thy khùng",user);
            UserDB.getFromId(user._id,(err,u)=>{
                if (!u) socket.emit("Change-socketid-failed");
                if(!err && u) {
                    socket.emit("Change-socketid-sucessfully","OKOK");
                socket.currentUser = u._id
                }
            }) 

          });
      })
      socket.on('Start-to-chat', async (data)=>{
          var roomID = data.roomID
          await ChatroomDB.findById(roomID,(err,room)=>{
                if(err)
                    socket.emit("message-error", err.message)
                if(!room){
                    socket.emit("message-error", "NOT_FOUND")
                }
          })
      })
      socket.on('Chat', async (data)=>{
        var roomID = data.roomID || ""

        await ChatroomDB.findById(roomID,(err,room)=>{
            if(err)
                socket.broadcast.emit("message-error", err.message)
            if(!room){
                socket.broadcast.emit("message-error", "NOT_FOUND")
            } else {
                socket.roomID = roomID
            }
            console.log("room",socket.roomID)
        })
        console.log('cur',socket.currentUser)
    })
    socket.on(socket.roomID, (data)=>{
        console.log(socket.roomID)
        socket.broadcast.emit('123123', data)
        console.log("AAAAAAAA",socket.roomID)
        console.log("i",data)
        var message = {
            createdTime: moment().format(),
            message: data.message || "",
            img: "",
            userID: socket.currentUser,
            roomID: socket.roomID
        }
        // await MessageDB.create(message,(err,mess)=>{
        //     if(err)  socket.emit("message-error", err.message)
        // })
      })
    //   socket.on("Create-chatroom", async (data) =>{
    //     console.log("Trần Huệ Thyyyyyyyyyyyyyyyyyyyyyyy", data.users)
    //     var roomID = ""
    //     data.users.forEach(e => {
    //         roomID += e._id
    //     });
    //     var room = {
    //         _id: roomID,
    //         users: data.users,
    //         expired: data.expired || null,
    //         createdTime: moment().format()
    //     }
    //     const temp = await ChatroomDB.create(room,(err,newRoom)=>{
    //         console.log(err,newRoom)
    //     })
    //     console.log(temp)
    //     // if (!temp) console.log("socket Client send message failed");
        // else {
        //   var user = {
        //     name: data.name,
        //     picture: data.picture,
        //     userID: data.id
        //   }
        //   console.log("send", temp);
        // socket.broadcast.in(temp[0].socketID).emit("Client-send-message", {user, message: data.message});
    //   })
      socket.on("Client-disconnect",function(){
        socket.disconnect(true);
        console.log(socket.adapter.rooms, socket.id);            
    });
}