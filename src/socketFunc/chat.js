const { getUser } = require("../utils/Users");

module.exports = function (io) {
    console.log('chat io')
    io.on("connection", (socket) => {  
        socket.on('clientMsg',({message})=>{
            console.log(message)
            const user = getUser(socket.id)
            const data = {text:message,user:user.username};
            console.log(user)
            io.to(user.room).emit("serverMsg",data);
        })
     });
  };
  