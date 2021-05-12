const {
  checkContest,
  removeContestUser,
  startContest,
  getTeamMembers,
  createURL,
} = require("../utils/Contest");
const axios = require("axios");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("Contest-Join", (user, callback) => {
      const obj = checkContest(user.RoomId, user.Name, socket.id);
      console.log(obj.contest);
      if (obj.error) {
        return callback({ error: obj.error, contest: obj.contest });
      } else {
        socket.join(user.RoomId);
        console.log("contest-joined");
        callback({ error: obj.error, contest: obj.contest });
        const teamMembers = getTeamMembers(obj.contest.UsersId);
        io.in(user.RoomId).emit("peopleInRoom", teamMembers);
      }
    });
    socket.on(
      "Start-Contest",
      ({ room, problemTags, minRating, maxRating }) => {
        const URL = createURL(problemTags);
        const problems = axios
          .get(URL)
          .then((res) => {
            const problemArray = res.data.result.problems.slice(0);
            // console.log(problemArray);
            const contest = startContest({
              room,
              problemTags,
              minRating,
              maxRating,
              problemArray,
            });
            const teamMembers = getTeamMembers(contest.UsersId);
            io.to(room).emit("Update", contest); //First update then send memebers
            io.to(room).emit("peopleInRoom", teamMembers);
          })
          .catch((e) => console.log(e));
      }
    );
    socket.on("Leave-Contest", (user) => {
      console.log("contest-Left");
      const contest = removeContestUser({ room: user.room, name: user.name });
      console.log(contest);
      const teamMembers = getTeamMembers(contest.UsersId);
      console.log(teamMembers);
      io.to(user.room).emit("peopleInRoom", teamMembers);
      socket.leave(user.room);
    });
  });
};
