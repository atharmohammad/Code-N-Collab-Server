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
const oAuthRouter = require("./routers/OauthRouter");
//const KEY = require("../config");
const app = express();
//Initialising the server instance
const server = http.createServer(app);

//Applying the middlewares
app.use(
  cors({
      "origin": process.env.CORS_ORIGIN,
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 200
  })
);

app.use(express.json());
//Server waking route
app.get('/',(req,res)=>{
  return res.status(200).send({ title: 'Waking Call..' });
})
app.use("/user", userRouter);
app.use("/Oauth", oAuthRouter);
app.use("/blogs", blogRouter);
app.use("/reply", replyRouter);
app.use("/comment", commentRouter);
 
//Initialising a socketio instance
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

require("./socketFunc/userJoin")(io);
require("./socketFunc/chat")(io);
require("./socketFunc/Compile")(io);
require("./socketFunc/problem")(io);
require("./socketFunc/Contest-Join")(io);

server.listen(port, () => console.log(`Listening on port ${port}`));
