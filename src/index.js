const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 8080;
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/UserRouter');
const blogRouter = require('./routers/BlogRouter')
//const KEY = require("../config");
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(express.json());
app.use('/user',userRouter);
app.use('/blogs',blogRouter);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

require('./SocketFunc/userJoin')(io)




server.listen(port, () => console.log(`Listening on port ${port}`));
