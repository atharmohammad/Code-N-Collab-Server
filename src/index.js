const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 8080;
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/UserRouter");
const blogRouter = require("./routers/BlogRouter");
const replyRouter = require("./routers/ReplyRouter");
const commentRouter = require("./routers/CommentRouter");
const oAuthRouter = require("./routers/Oauth");

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
app.use("/user", userRouter);
app.use('/Oauth',oAuthRouter);
app.use("/blogs", blogRouter);
app.use('/reply',replyRouter);
app.use('/comment',commentRouter);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

require("./SocketFunc/userJoin")(io);
require("./SocketFunc/chat")(io);
require("./SocketFunc/Compile")(io);
require("./SocketFunc/problem")(io);
require("./SocketFunc/Contest-Join")(io);

server.listen(port, () => console.log(`Listening on port ${port}`));
