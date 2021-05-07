const { getUser } = require("../utils/Users");
const { compilerFunc } = require("../Function/compilerFunc");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("Compile_ON", ({ language, code, input }) => {
      const user = getUser(socket.id);
      if (!user) {
        return;
      }
      socket.broadcast.to(user.room).emit("Compile_ON");

      compilerFunc(language, code, input)
        .then((res) => {
          console.log("response", res.data);
          io.to(user.room).emit("COMPILE_OFF", res.data);
        })
        .catch((e) => {
          console.log("error:", e.data);
          io.to(user.room).emit("COMPILE_OFF", e.data);
        });
    });
  });
};
