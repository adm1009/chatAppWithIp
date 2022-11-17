const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://192.168.1.111:3000",
    origin: "http://192.168.1.111:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("disconnect",()=>{
    console.log(`User Disconnected with id:- ${socket.id}`); 
  });

  socket.on("join_room", (data) => {
    socket.join(data.roomid);
    io.to(data.roomid).emit("noofuser",io.sockets.adapter.rooms.get(data.roomid).size);
  });

  socket.on("send_message", (data) => {
    io.to(data.roomid).emit("receive_message", {msgList:data.msgList,roomid:data.roomid,username:data.username,msg:data.msg});
  });
    
  socket.on("leaveroom",(data)=>{
      socket.leave(data.roomid);
      socket.disconnect();
      io.to(data.roomid).emit("userleft",{username:data.username,roomid:data.roomid,usercount:io.sockets.adapter.rooms.get(data.roomid).size});
  })
});

server.listen(3010, () => {
  console.log("SERVER IS RUNNING");
});