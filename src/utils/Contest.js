const axios = require("axios");

let contests = []; //contains all contests

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
  } else if (contest.Started && !user) {
    return { error: "Contest has Already Started !", contest: null };
  } else if (usersCnt == 4 && !user) {
    return { error: "Room is Full", contest: null };
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
    StartTime: new Date().getTime(),
    userToProblem: new Map(),
  };
  contests.push(lockout);
  console.log("contest-created!");
  return { error: null, contest: lockout };
};

const joinContest = (roomId, name, socketid, co) => {
  const contest = contests.find((con, index) => con.Id === roomId);
  const user = contest.Users.find((user, i) => user.Name === name);
  const userId = contest.UsersId.find((user, i) => user === name);

  if (!contest) {
    return;
  }

  if (user && userId) {
    user.SocketId = socketid;
    return { error: null, contest: contest };
  } else if (user) {
    user.SocketId = socketid;
    contest.UsersId.push(name);
    return { error: null, contest: contest };
  }

  const newUser = {
    Name: name,
    Score: 0,
    SocketId: socketid,
  };

  contest.UsersId.push(name);
  contest.Users.push(newUser);

  console.log("Joined the existing contest");
  return { error: null, contest: contest };
};

const removeContestUser = ({ roomId, name }) => {
  const contest = contests.find((con, index) => con.Id === roomId);

  if (!contest) {
    return;
  }

  const UserIds = contest.UsersId;
  const users = UserIds.filter((id, i) => id !== name);
  contest.UsersId = users;
  console.log(contest, "removed user");
  return contest;
};

const startContest = ({
  room,
  problemTags,
  minRating,
  maxRating,
  maxDuration,
  problemArray,
}) => {
  ////setting up problems////
  shuffle(problemArray);

  const problems = [];
  const problemLink = "https://codeforces.com/problemset/problem/";
  let problemCount = 0;

  if (!maxDuration || maxDuration < 10 || maxDuration > 120) {
    maxDuration = 30;
  }

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
  const contest = contests.find((cont, ind) => cont.Id === room);
  if (!contest) {
    return null;
  }
  contest.Started = true; //Starting the contest
  contest.EndTime = curr_time.getTime() + maxDuration * 60 * 1000;
  contest.Problems = problems;
  contest.problemTags = problemTags;
  contest.minRating = minRating;
  contest.maxRating = maxRating;
  /////***///////////

  console.log(contest);
  return contest;
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
  console.log("tags:", problemTags, tags);
  const URL = `https://codeforces.com/api/problemset.problems?tags=${tags}`;
  return URL;
};

const updateContest = async (roomId) => {
  const contest = contests.find((con, index) => con.Id === roomId);
  if (!contest) {
    return;
  }

  const unsolvedProblems = [];

  contest.Problems.forEach((prob, i) => {
    if (!contest.userToProblem.has(prob.name)) {
      unsolvedProblems.push(prob.name);
    }
  });

  console.log(unsolvedProblems);

  const promise = await contest.UsersId.map(async (user, i) => {
    const URL = `https://codeforces.com/api/user.status?handle=${user}&from=1&count=10`;
    try {
      const res = await axios.get(URL);
      unsolvedProblems.map((prob, j) => {
        checkIfProblemSolved(user, prob, roomId, res.data.result);
      });
      console.log("fullfilled");
    } catch (e) {
      console.log("rejected");
    }
    return;
  });
  try {
    await Promise.all(promise);
    updateScores(roomId);
  } catch (e) {
    console.log("no such user");
  }
  return contest;
};

const checkIfProblemSolved = (user, unsolvedProblem, roomId, arr) => {
  const contest = contests.find((con, index) => con.Id === roomId);

  if (!contest) {
    return;
  }

  arr.every((prob, i) => {
    if (check(contest, unsolvedProblem, prob)) {
      if (
        contest.userToProblem.has(prob.problem.name) &&
        contest.userToProblem.get(prob.problem.name).time >
          prob.creationTimeSeconds
      ) {
        contest.userToProblem.set(prob.problem.name, {
          time: prob.creationTimeSeconds,
          author: user,
          points: prob.problem.rating,
        });
      } else if (!contest.userToProblem.has(prob.problem.name)) {
        contest.userToProblem.set(prob.problem.name, {
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
  const contest = contests.find((con, index) => con.Id === roomId);

  if (!contest) {
    return;
  }

  const score = new Map();
  contest.userToProblem.forEach((values, keys) => {
    if (score.has(values.author)) {
      const prevScore = score.get(values.author).points;
      score.set(values.author, { points: prevScore + values.points });
    } else {
      score.set(values.author, { points: values.points });
    }
  });

  contest.Users.forEach((user, i) => {
    if (score.has(user.Name)) {
      contest.Users[i].Score = score.get(user.Name).points;
    }
  });

  contest.Users.sort((a, b) => b.Score - a.Score);

  contest.Problems.map((problem, i) => {
    if (contest.userToProblem.has(problem.name)) {
      problem.solved = true;
      problem.author = contest.userToProblem.get(problem.name).author;
    }
  });
};

const check = (contest, unsolvedProblem, prob) => {
  const cftime = prob.creationTimeSeconds * 1000;
  console.log("cftime", cftime, "\n", "\n");

  return (
    prob.problem.name.trim().toLowerCase() ==
      unsolvedProblem.trim().toLowerCase() &&
    prob.verdict == "OK" &&
    cftime >= contest.StartTime &&
    cftime <= contest.EndTime
  );
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

const getContestLength = () => {
  return contests.length;
};

const deleteContests = () => {
  const curr_time = new Date().getTime();
  const deleteBeforeTime = curr_time - 24 * 60 * 60 * 1000;
  let temp = [];
  for (let i = 0; i < contests.length; i++) {
    if (contest[i].StartTime > deleteBeforeTime) temp.push(contests[i]);
  }
  contests = temp;
};

module.exports = {
  checkContest,
  removeContestUser,
  startContest,
  getTeamMembers,
  createURL,
  updateContest,
  getContest,
  getContestLength,
  deleteContests,
};
