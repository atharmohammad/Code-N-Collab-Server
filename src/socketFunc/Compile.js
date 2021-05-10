const { getUser } = require("../utils/Users");
const { compilerFunc } = require("../Function/compilerFunc");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("Compile_ON", ({ language, code, input }) => {
      const sids = io.of("/").adapter.sids;
      const room = [...sids.get(socket.id)][1];

      if (!room) {
        return;
      }
      socket.broadcast.to(room).emit("Compile_ON");

      compilerFunc(language, code, input)
        .then((res) => {
          console.log("response", res.data);
          io.to(room).emit("COMPILE_OFF", res.data);
        })
        .catch((e) => {
          console.log("error:", e);
          io.to(room).emit("COMPILE_OFF", e.data);
        });
    });
  });
};
