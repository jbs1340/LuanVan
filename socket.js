const jwt = require('jsonwebtoken');
var UserDB = require("./models/user");
var ChatroomDB = require("./models/chatroom");
var moment = require('moment')

require('dotenv').config();
exports.socketio = function (socket){
    socket.on("Client-login", async (data)=>{
        console.log(data)
        var verify = jwt.verify(data, process.env.SECRET_KEY,(err,user)=>{
            console.log("Thy khùng",user);
            UserDB.getFromId(user._id,(err,u)=>{
                if (!u) socket.emit("Change-socketid-failed");
                if(!err && u) socket.emit("Change-socketid-sucessfully","OKOK");
            }) 

          });
      })
      socket.on('Start-to-chat', async (data)=>{
          var roomID = data.roomID
      })
      socket.on("Create-chatroom", async (data) =>{
        console.log("Trần Huệ Thyyyyyyyyyyyyyyyyyyyyyyy", data.users)
        var roomID = ""
        data.users.forEach(e => {
            roomID += e._id+"-"
        });
        var room = {
            _id: roomID,
            users: data.users,
            expired: data.expired || null,
            createdTime: moment().format()
        }
        const temp = await ChatroomDB.create(room,(err,newRoom)=>{
            console.log(err,newRoom)
        })
        console.log(temp)
        // if (!temp) console.log("socket Client send message failed");
        // else {
        //   var user = {
        //     name: data.name,
        //     picture: data.picture,
        //     userID: data.id
        //   }
          console.log("send", temp);
        // socket.broadcast.in(temp[0].socketID).emit("Client-send-message", {user, message: data.message});
      })
      socket.on("Client-disconnect",function(){
        socket.disconnect(true);
        console.log(socket.adapter.rooms, socket.id);            
    });
}