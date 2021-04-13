const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require('axios')
const port = process.env.PORT || 8080;
const KEY = require('../config');

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on('join',data=>{
      socket.join(data.room);
      console.log(data.room,data.user)
      //To get data for newly connected client from the room
      axios.get('http://localhost:8000/api/rest/domains/convergence/default/models/'+data.room,{
        "headers":{
          "Authorization": KEY
        }
      }).then(res=>{
        console.log(res.data.body.data.text)
        io.to(socket.id).emit('initialCode',res.data.body.data.text)
      })
        .catch(e=>console.log(e));
    })

    socket.on('disconnect',()=>{
      console.log('Disconnected')
    })
});

server.listen(port, () => console.log(`Listening on port ${port}`));
