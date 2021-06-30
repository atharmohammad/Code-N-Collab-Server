const { getUser } = require("../utils/Users");

module.exports = function (io) {
  try {
    io.on("connection", (socket) => {
      socket.on("clientMsg", ({ message }) => {
        try {
          const user = getUser(socket.id);
          if (!user) {
            return;
          }
          const data = { text: message, user: user.username };

          io.to(user.room).emit("serverMsg", data);
        } catch (e) {
          console.log(e);
        }
      });
      socket.on("Contest-Msg", ({ message, room, name }) => {
        try {
          const data = { text: message, user: name };
          io.to(room).emit("serverMsg", data);
        } catch (e) {
          console.log(e);
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};
