const axios = require("axios");
const {
  checkContest,
  removeContestUser,
  startContest,
  getTeamMembers,
  createURL,
  updateContest,
  getContestLength,
  deleteContests,
} = require("../utils/Contest");

let DeleteIntervalOn = false;

module.exports = function (io) {
  try {
    io.on("connection", (socket) => {
      socket.on("Contest-Join", (user, callback) => {
        if (!user || !user.Name || !user.Name.trim()) {
          return callback({ error: "Update Codeforces Handle", contest: null });
        }
        if (!user.RoomId || !user.RoomId.trim()) {
          return callback({ error: "Invalid room Name", contest: null });
        }

        const obj = checkContest(user.RoomId, user.Name, socket.id);
        console.log(obj.contest);
        if (obj.error) {
          return callback({ error: obj.error, contest: obj.contest });
        } else {
          if (!DeleteIntervalOn) {
            console.log("Starting Interval");
            DeleteIntervalOn = true;
            const interval = setInterval(() => {
              console.log("deleting data.....");
              deleteContests();
              if (getContestLength() == 0) {
                console.log("Stopping Interval");
                DeleteIntervalOn = false;
                clearInterval(interval);
              }
            }, 24 * 60 * 60 * 1000);
          }
          socket.join(user.RoomId);
          console.log("contest-joined");
          callback({ error: obj.error, contest: obj.contest });
          const teamMembers = getTeamMembers(obj.contest.UsersId);
          io.in(user.RoomId).emit("peopleInRoom", {
            teamMembers,
            userJoin: user.Name.trim().toLowerCase(),
          });
        }
      });
      socket.on(
        "Start-Contest",
        ({ room, problemTags, minRating, maxRating, maxDuration }) => {
          socket.to(room).emit("Contest-Starting");
          problemTags = problemTags.map((tag) => tag.label);
          const URL = createURL(problemTags);
          const problems = axios
            .get(URL)
            .then((res) => {
              console.log(res);
              const problemArray = res.data.result.problems.slice(0);
              const contest = startContest({
                room,
                problemTags,
                minRating,
                maxRating,
                problemArray,
                maxDuration,
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
        const contest = removeContestUser({
          roomId: user.roomId,
          name: user.name,
        });
        console.log(contest);
        const teamMembers = getTeamMembers(contest.UsersId);
        console.log(teamMembers);
        io.to(user.room).emit("peopleInRoom", {
          teamMembers,
          userLeft: user.name.trim().toLowerCase(),
        });
        socket.leave(user.room);
      });
    });
  } catch (e) {
    console.log(e);
  }
};
