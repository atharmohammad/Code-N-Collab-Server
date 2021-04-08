const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 8080;

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

io.on("connection", (socket) => {
    console.log("New client connected");
  });

server.listen(port, () => console.log(`Listening on port ${port}`));