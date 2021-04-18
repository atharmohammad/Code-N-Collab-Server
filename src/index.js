const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 8080;
const KEY = require("../config");
const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

require('./SocketFunc/userJoin')(io)

server.listen(port, () => console.log(`Listening on port ${port}`));
