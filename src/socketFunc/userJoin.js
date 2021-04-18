const axios = require('axios');
const KEY = require('../../config')

module.exports = function(io){    
    io.on("connection", (socket) => {
        let Data = null;
    
        console.log("New client connected");
        socket.on("join", (data) => {
        Data = data;
        socket.join(data.room);
        console.log(data.room, data.user);
        //To get data for newly connected client from the room
        try {
            const socketsInstances = async () => {
            const clients = await io.in(Data.room).fetchSockets();
            //counts how many users are active in room
            let res = "";
            if (clients.length > 1) {
                //only if there are other clients than only we get data because otherwise models has not been created
                res = await axios.get(
                "http://localhost:8000/api/rest/domains/convergence/default/models/" +
                    data.room,
                {
                    headers: {
                    Authorization: KEY,
                    },
                }
                );
    
                console.log(res.data.body.data.text);
                io.to(socket.id).emit("initialCode", res.data.body.data.text);
            }
            };
    
            socketsInstances();
        } catch (e) {
            console.log(e);
        }
        });
    
        socket.on("disconnect", () => {
        //Deleting the model when everyone leaves the room
        try {
            const socketsInstances = async () => {
            const clients = await io.in(Data.room).fetchSockets();
            const users = clients.length;
            if (users == 0) {
                axios
                .delete(
                    "http://localhost:8000/api/rest/domains/convergence/default/models/" +
                    Data.room,
                    {
                    headers: {
                        Authorization: KEY,
                    },
                    }
                )
                .then((res) => {
                    console.log("Deleted");
                })
                .catch((e) => console.log(e));
            }
            socket.leave(Data.room);
            console.log("Disconnected");
            };
            socketsInstances();
        } catch (e) {
            console.log(e);
        }
        });
    });
}