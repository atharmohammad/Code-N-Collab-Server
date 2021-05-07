const { getUser } = require("../utils/Users");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("clientMsg", ({ message }) => {
      console.log(message);
      const user = getUser(socket.id);
      if (!user) {
        return;
      }
      const data = { text: message, user: user.username };
      console.log(user);
      io.to(user.room).emit("serverMsg", data);
    });
  });
};
