const {checkContest,
  removeContestUser,
  startContest}= require('../utils/Contest');

module.exports = function(io){
  io.on("connection",(socket)=>{
    socket.on("Contest-Join",(user,callback)=>{
      console.log("contest-joined");
      const obj = checkContest(user.RoomId,user.Name,socket.id);
      console.log(obj.contest);
      socket.join(user.RoomId);
      return callback({error:obj.error,contest:obj.contest});
    });
    socket.on("Start-Contest",(roomId)=>{
      const contest = startContest(roomId);
      io.in(roomId).emit("Update",contest);
    })
    socket.on("Leave-Contest",(user)=>{
      console.log("contest-Left");
      const contest = removeContestUser({room:user.room,name:user.name});
      console.log(contest)
      io.in(user.room).emit("Update",contest);
    })
  })
}
