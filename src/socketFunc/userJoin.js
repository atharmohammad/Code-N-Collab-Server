const axios = require("axios");
const KEY = require("../../Configs/config");
const { addUser, removeUser, getUser } = require("../utils/Users");

module.exports = function (io) {
  console.log("started");

  io.on("connection", (socket) => {
    socket.on("join", ({ username, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, username, room });

      if (error) {
        console.log("ops");
        return callback({ error });
      }
      try {
        socket.join(user.room);
        console.log("A new user joined", user.room, user.username, user.id);
      } catch (e) {
        console.log("cant join");
      }

      //To get data for newly connected client from the room
      const socketsInstances = async () => {
        try {
          const clients = await io.in(user.room).fetchSockets();

          //counts how many users are active in room
          let res = "";
          if (clients.length > 1) {
            //make functions for getting data
            let askedCnt = 0;

            for (const client of clients) {
              if (askedCnt == 5) break;
              if (client.id === socket.id) continue;
              askedCnt++;
              io.to(client.id).emit("sendInitialIO", { id: socket.id });
            }

            //only if there are other clients than only we get data because otherwise models has not been created
            res = await axios.get(
              "http://localhost:8000/api/rest/domains/convergence/default/models/" +
                user.room,
              {
                headers: {
                  Authorization: KEY,
                },
              }
            );
            console.log(res.data.body.data.text);
            io.to(socket.id).emit("initialCode", res.data.body.data.text);
          }
        } catch (e) {
          //console.log('hippi ',e)
        }
      };

      socketsInstances();
      return callback({ user });
    });


    socket.on("takeInitialIO", ({ id, inputText, outputText }) => {
      console.log("takeInitialIO", inputText, outputText);
      console.log("done");
      io.to(id).emit("initialIO", { inputText, outputText });
    });

    socket.on("changeIO", ({ inputText, outputText }) => {
      const user = getUser(socket.id);
      console.log("changeIO", user);
      socket.broadcast
        .to(user.room)
        .emit("initialIO", { inputText, outputText });
    });

    socket.on("disconnect", () => {
      //Deleting the model when everyone leaves the room
      const user = removeUser(socket.id);
      console.log("disconnecting", socket.id, user);
      if (user) {
        try {
          const socketsInstances = async () => {
            const clients = await io.in(user.room).fetchSockets();

            if (clients.length == 0) {
              axios
                .delete(
                  "http://localhost:8000/api/rest/domains/convergence/default/models/" +
                    user.room,
                  {
                    headers: {
                      Authorization: KEY,
                    },
                  }
                )
                .then((res) => {
                  console.log("Deleted");
                })
                .catch((e) => {
                  //console.log(e)
                });
            }
            socket.leave(user.room);
            console.log("Disconnected");
          };
          socketsInstances();
        } catch (e) {
          console.log(e);
        }
      }
    });
  });
};
