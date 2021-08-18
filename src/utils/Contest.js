const axios = require("axios");

//Storing all the contest data
let contests = []; 

//checking the contest existence and its validation
const checkContest = (roomId, name, socketid) => {
  try{
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
  }catch(e){
      return {
        error: "There might be an error! Please Try again !",
        contest: null,
      };
  }
};

//Creating a contest
const createContest = (roomId, name, socketid) => {
  try{
    //initialising the User object 
    const user = {
      Name: name,
      Score: 0,
      SocketId: socketid,
    };

    //initialising the contest object
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

    //Inserting the contest in the array
    contests.push(lockout);
    console.log("contest-created!");
    return { error: null, contest: lockout };
  }catch(e){
    return {
      error: "There might be an error! Please Try again !",
      contest: null,
    };
  }

};

//If contest already exist and user is valid then join the contest
const joinContest = (roomId, name, socketid, co) => {
  try{
    //Finding the user , contest with in the array
    const contest = contests.find((con, index) => con.Id === roomId);
    const user = contest.Users.find((user, i) => user.Name === name);
    const userId = contest.UsersId.find((user, i) => user === name);

    //If no contest exist return
    if (!contest) {
      return;
    }

    //If both user and userId is available means the user hadn't exit the contest
    if (user && userId) {
      user.SocketId = socketid;
      return { error: null, contest: contest };
    } else if (user) {
      //If user joins the contest again after exiting
      user.SocketId = socketid;
      contest.UsersId.push(name);
      return { error: null, contest: contest };
    }

    //If new user joined the contest before starting
    const newUser = {
      Name: name,
      Score: 0,
      SocketId: socketid,
    };

    contest.UsersId.push(name);
    contest.Users.push(newUser);

    console.log("Joined the existing contest");
    return { error: null, contest: contest };

  }catch(e){
    return {
      error: "There might be an error! Please Try again !",
      contest: null,
    };
  }
};

//Removing the contest user on its exit

  const removeContestUser = ({ roomId, name }) => {
    //Finding the contest 
    try {
      const contest = contests.find((con, index) => con.Id === roomId);

      if (!contest) {
        return;
      }

      //Filtering the userId for removal , user name will remain to show on leaderboard
      const UserIds = contest.UsersId;
      const users = UserIds.filter((id, i) => id !== name);
      contest.UsersId = users;
      console.log(contest, "removed user");
      return contest;
    } catch (e) {
      return {
        error: "There might be an error! Please Try again !",
        contest: null,
      };
    }
  };

  //starting the contest and fetching problems
const startContest = ({
  room,
  problemTags,
  minRating,
  maxRating,
  maxDuration,
  problemArray,
}) => {
  try{
    ////setting up problems////
    shuffle(problemArray);

    const problems = [];
    const problemLink = "https://codeforces.com/problemset/problem/";
    let problemCount = 0;

    if (!maxDuration || maxDuration < 10 || maxDuration > 120) {
      maxDuration = 30;
    }

    //Selecting the problems after filtering
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
  }catch(e){
    return {
      error: "There might be an error! Please Try again !",
      contest: null,
    };
  }

};

//To return a list of team members in a contest
const getTeamMembers = (userIds) => {
  try{
    const newId = [];
    userIds.forEach((id) => {
      newId.push({ username: id });
    });
    return newId;
  }catch(e){
    return {
      error: "There might be an error! Please Try again !",
      contest: null,
    };
  }

};

//Creating the url to fetch problems with certaing filtering
const createURL = (problemTags) => {
  try{
    const tags = problemTags.join(";");
    const URL = `https://codeforces.com/api/problemset.problems?tags=${tags}`;
    return URL;
  }catch(e){
    return {
      error: "There might be an error! Please Try again !",
      contest: null,
    };
  }

};

//Updating the leaderboard and problems in the contest
const updateContest = async (roomId) => {
  try{
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

    //Checking the problems solved by each user
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

    //awaiting all the promises to return
    try {
      await Promise.all(promise);
      updateScores(roomId);
    } catch (e) {
      console.log("no such user");
    }
    return contest;
  }catch(e){
    return {
      error: "There might be an error! Please Try again !",
      contest: null,
    };
  }
};

//Validation and checking the problem solving before updating
const checkIfProblemSolved = (user, unsolvedProblem, roomId, arr) => {
  try{
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
  }catch(e){
    return {
      error: "There might be an error! Please Try again !",
      contest: null,
    };
  }

};

//Updating the scores for the leader board
const updateScores = (roomId) => {
  try{
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
  }catch(e){
    return {
      error: "There might be an error! Please Try again !",
      contest: null,
    };
  }

};

//Checking the time when the problem was solved
const check = (contest, unsolvedProblem, prob) => {

  try{
    const cftime = prob.creationTimeSeconds * 1000;

    return (
      prob.problem.name.trim().toLowerCase() ==
        unsolvedProblem.trim().toLowerCase() &&
      prob.verdict == "OK" &&
      cftime >= contest.StartTime &&
      cftime <= contest.EndTime
    );
  }catch(e){
    return {
      error: "There might be an error! Please Try again !",
      contest: null,
    };
  }

};

//Shuffling the problems array to pick random problems
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

//Return the contest with specific roomId
const getContest = (roomId) => {
  return contests.find((con, index) => con.Id === roomId);
};

const getContestLength = () => {
  return contests.length;
};


//Removes the contest if exceeds the 24hrs of time
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
