const axios = require("axios");
const KEY = require("../../Configs/config");
const { addUser, removeUser, getUser,getUsersInRoom,removePassword } = require("../utils/Users");

module.exports = function (io) {

  io.on("connection", (socket) => {
    socket.on("join", ({ username, room,password }, callback) => {
      const { error, user } = addUser({ id: socket.id, username, room, password });

      if (error) {
        return callback({ error });
      }
      try {
        socket.join(user.room);
 
        console.log("A new user joined", user.room, user.username);
      } catch (e) {
        return console.log("cant join");
      }

      //To get data for newly connected client from the room
      const socketsInstances = async () => {
        try {
          const clients = await io.in(user.room).fetchSockets();
          const teamMembers  = getUsersInRoom(user.room) 
          io.to(user.room).emit('peopleInRoom',teamMembers); 
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
      io.to(id).emit("initialIO", { inputText, outputText });
    });

    socket.on("changeIO", ({ inputText, outputText }) => {
      const user = getUser(socket.id);
      if(!user)
        return
      socket.broadcast
        .to(user.room)
        .emit("initialIO", { inputText, outputText });
    });

    socket.on("disconnect", () => {
      //Deleting the model when everyone leaves the room
      const user = removeUser(socket.id);
      if(!user)
        return;
      console.log("disconnecting", user);
      
      if (user) {
        try {
          const socketsInstances = async () => {
            const clients = await io.in(user.room).fetchSockets();
            const teamMembers  = getUsersInRoom(user.room) 
            if(clients.length){
              io.to(user.room).emit('peopleInRoom',teamMembers); 
            }
            
            if (clients.length == 0) {
              removePassword(user.room);
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
