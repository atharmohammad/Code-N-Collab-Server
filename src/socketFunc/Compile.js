const { getUser } = require("../utils/Users");

module.exports = function (io) {
    io.on("connection", (socket) => {
        socket.on('Compile_ON',()=>{
            const user = getUser(socket.id)
            console.log(user)
            socket.broadcast.to(user.room).emit('Compile_ON');
        })
        socket.on('Compile_OFF',()=>{
            const user = getUser(socket.id)
            console.log(user)
            socket.broadcast.to(user.room).emit('Compile_OFF');
        })
     });
  };
