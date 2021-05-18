const axios = require("axios");

const {
  checkContest,
  removeContestUser,
  startContest,
  getTeamMembers,
  createURL,
  updateContest,
  getContest,
} = require("../utils/Contest");

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
        socket.to(room).emit("Contest-Starting");
        problemTags = problemTags.map((tag) => tag.label);
        const URL = createURL(problemTags);
        const problems = axios
          .get(URL)
          .then((res) => {
            const problemArray = res.data.result.problems.slice(0);
            const contest = startContest({
              room,
              problemTags,
              minRating,
              maxRating,
              problemArray,
            });
            const teamMembers = getTeamMembers(contest.UsersId);
            io.to(room).emit("Update", contest); //First update then send memebers
          })
          .catch((e) => console.log(e));
      }
    );
    socket.on("Contest-Update", async ({ roomId }) => {
      const contest = await updateContest(roomId);
      console.log(contest);
      io.to(roomId).emit("Update", contest);
    });
    socket.on("Leave-Contest", (user) => {
      console.log("contest-Left");
      const contest = removeContestUser({ roomId, name: user.name });
      console.log(contest);
      const teamMembers = getTeamMembers(contest.UsersId);
      console.log(teamMembers);
      io.to(user.room).emit("peopleInRoom", teamMembers);
      socket.leave(user.room);
    });
  });
};
