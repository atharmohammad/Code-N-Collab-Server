const { getUser } = require("../utils/Users");
const { compilerFunc } = require("../Function/compilerFunc");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("Compile_ON", ({ language, code, input, reason }) => {
      const sids = io.of("/").adapter.sids;
      const room = [...sids.get(socket.id)][1];

      if (!room) {
        return;
      }

      if (reason === "code-editor")
        socket.broadcast.to(room).emit("Compile_ON");

      compilerFunc(language, code, input)
        .then((res) => {
         
          if (reason === "code-editor")
            io.to(room).emit("COMPILE_OFF", res.data);
          else io.to(socket.id).emit("COMPILE_OFF", res.data);
        })
        .catch((e) => {
         
          if (reason === "code-editor") io.to(room).emit("COMPILE_OFF", e.data);
          else io.to(socket.id).emit("COMPILE_OFF", res.data);
        });
    });
  });
};
