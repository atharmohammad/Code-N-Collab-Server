const { getUser } = require("../utils/Users");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("clientMsg", ({ message }) => {
      
      const user = getUser(socket.id);
      if (!user) {
        return;
      }
      const data = { text: message, user: user.username };
      
      io.to(user.room).emit("serverMsg", data);
    });
    socket.on("Contest-Msg", ({ message, room, name }) => {
      const data = { text: message, user: name };
     
      io.to(room).emit("serverMsg", data);
    });
  });
};
