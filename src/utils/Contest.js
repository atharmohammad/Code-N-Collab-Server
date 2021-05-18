const axios = require("axios");

const contests = []; //contains all contests

const checkContest = (roomId, name, socketid) => {
  const contest = contests.find((con, index) => con.Id === roomId);
  let user = undefined;
  let usersCnt = 0;

  if (contest) {
    user = contest.UsersId.find((user, index) => user === name);
    usersCnt = contest.UsersId.length;
  }

  if (!contest) {
    return createContest(roomId, name, socketid);
  } else if (usersCnt == 4 && !user) {
    return { error: "Room is Full", contest: null };
  } else if (contest.Started && !user) {
    return { error: "Contest has Already Started !", contest: null };
  } else if (usersCnt < 4 || user) {
    return joinContest(roomId, name, socketid, contest);
  } else {
    return {
      error: "There might be an error! Please Try again !",
      contest: null,
    };
  }
};

const createContest = (roomId, name, socketid) => {
  const user = {
    Name: name,
    Score: 0,
    SocketId: socketid,
  };

  const lockout = {
    Id: roomId,
    Users: [user],
    UsersId: [name],
    EndTime: null,
    Problems: [],
    Started: false,
    problemTags: [],
    minRating: 0,
    maxRating: 0,
    StartTime: (new Date()).getTime(),
    userToProblem: new Map(),
  };
  contests.push(lockout);
  console.log("contest-created!");
  return { error: null, contest: lockout };
};

const joinContest = (roomId, name, socketid, contest) => {
  const userIndex = contest.UsersId.findIndex((user, i) => user === name);
  const contestIndex = contests.findIndex((con, index) => con.Id === roomId);

  if (userIndex != -1) {
    //Change the socket id of the user that joined again!
    console.log("contest already joined");
    contests[contestIndex].Users[userIndex].SocketId = socketid;
    return { error: null, contest: contests[contestIndex] };
  }

  const user = {
    Name: name,
    Score: 0,
    SocketId: socketid,
  };

  contests[contestIndex].UsersId.push(name);
  contests[contestIndex].Users.push(user);

  console.log("Joined the existing contest");
  return { error: null, contest: contests[contestIndex] };
};

const removeContestUser = ({ roomId, name }) => {
  const contestIndex = contests.findIndex((con, index) => con.Id === roomId);
  const UserIds = contests[contestIndex].UsersId;
  const users = UserIds.filter((id, i) => id !== name);
  contests[contestIndex].UsersId = users;

  return contests[contestIndex];
};

const startContest = ({
  room,
  problemTags,
  minRating,
  maxRating,
  problemArray,
}) => {
  ////setting up problems////
  shuffle(problemArray);

  const problems = [];
  const problemLink = "https://codeforces.com/problemset/problem/";
  let problemCount = 0;
  let contestIndex = -1;

  problemArray.every((problem, i) => {
    if (
      problem.rating >= parseInt(minRating) &&
      problem.rating <= parseInt(maxRating)
    ) {
      const link = problemLink + problem.contestId + "/" + problem.index + "/";
      problems.push({
        key: i,
        link: link,
        name: problem.name,
        points: problem.rating,
        solved: false,
        author: null,
      });
      problemCount++;
      if (problemCount == 5) return false;

      return true;
    }
    return true;
  });
  const curr_time = new Date(); 
  ////********/////////
  /////Setting up the contest////
  contests.every((cont, ind) => {
    if (cont.Id === room) {
      contestIndex = ind;
      contests[ind].Started = true; //Starting the contest
      contests[ind].EndTime = curr_time.getTime() + 2*60*60*1000;
      contests[ind].Problems = problems;
      contests[ind].problemTags = problemTags;
      contests[ind].minRating = minRating;
      contests[ind].maxRating = maxRating;
      return false;
    }
    return true;
  });
  /////***///////////

  console.log(contests[contestIndex]);
  return contests[contestIndex];
};

const getTeamMembers = (userIds) => {
  const newId = [];
  userIds.forEach((id) => {
    newId.push({ username: id });
  });
  return newId;
};

const createURL = (problemTags) => {
  const tags = problemTags.join(";");
  console.log('tags:',problemTags,tags)
  const URL = `https://codeforces.com/api/problemset.problems?tags=${tags}`;
  return URL;
};

const updateContest = async (roomId) => {
  const contestIndex = contests.findIndex((con, index) => con.Id === roomId);

  if (contestIndex == -1) return;

  const contest = contests[contestIndex];
  const unsolvedProblems = [];

  contest.Problems.forEach((prob, i) => {
    if (!contest.userToProblem.has(prob.name)) {
      unsolvedProblems.push(prob.name);
    }
  });

  console.log(unsolvedProblems);

  const promise = await contest.UsersId.map(async (user, i) => {
    const URL = `https://codeforces.com/api/user.status?handle=${user}&from=1&count=10`;
    const res = await axios.get(URL);
    unsolvedProblems.map((prob, j) => {
      checkIfProblemSolved(user, prob, roomId, res.data.result);
    });
    return;
  });
  try{
  await Promise.all(promise);
  updateScores(roomId);
  }catch(e){
    console.log('no such user');
  }
  return contests[contestIndex];
};

const checkIfProblemSolved = (user, unsolvedProblem, roomId, arr) => {
  const contestIndex = contests.findIndex((con, index) => con.Id === roomId);

  arr.every((prob, i) => {
    if (check(unsolvedProblem, prob)) {
      if (
        contests[contestIndex].userToProblem.has(prob.problem.name) &&
        contests[contestIndex].userToProblem.get(prob.problem.name).time >
          prob.creationTimeSeconds
      ) {
        contests[contestIndex].userToProblem.set(prob.problem.name, {
          time: prob.creationTimeSeconds,
          author: user,
          points: prob.problem.rating,
        });
      } else if (!contests[contestIndex].userToProblem.has(prob.problem.name)) {
        contests[contestIndex].userToProblem.set(prob.problem.name, {
          time: prob.creationTimeSeconds,
          author: user,
          points: prob.problem.rating,
        });
      } else {
        console.log("error");
      }
    }
  });
};

const updateScores = (roomId) => {
  const contestIndex = contests.findIndex((con, index) => con.Id === roomId);

  const score = new Map();
  contests[contestIndex].userToProblem.forEach((values, keys) => {
    if (score.has(values.author)) {
      const prevScore = score.get(values.author).points;
      score.set(values.author, { points: prevScore + values.points });
    } else {
      score.set(values.author, { points: values.points });
    }
  });

  contests[contestIndex].Users.forEach((user, i) => {
    if (score.has(user.Name)) {
      contests[contestIndex].Users[i].Score = score.get(user.Name).points;
    }
  });

  contests[contestIndex].Users.sort((a, b) => a.Score - b.Score);

  contests[contestIndex].Problems.map((problem, i) => {
    if (contests[contestIndex].userToProblem.has(problem.name)) {
      problem.solved = true;
      problem.author = contests[contestIndex].userToProblem.get(
        problem.name
      ).author;
    }
  });
};

const check = (unsolvedProblem, prob) => {
  return (
    prob.problem.name.trim().toLowerCase() ==
      unsolvedProblem.trim().toLowerCase() && prob.verdict == "OK"
  );
  //  prob.creationTimeSeconds >= contests[contestIndex].StartTime
  //  &&
  // prob.creationTimeSeconds <= contests[contestIndex].EndTime)
};

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

const getContest = (roomId) => {
  return contests.find((con, index) => con.Id === roomId);
};

module.exports = {
  checkContest: checkContest,
  removeContestUser: removeContestUser,
  startContest: startContest,
  getTeamMembers: getTeamMembers,
  createURL: createURL,
  updateContest: updateContest,
  getContest: getContest,
};
