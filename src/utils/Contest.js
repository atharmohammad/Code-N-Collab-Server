const axios = require("axios");

const contests = []; //contains all contests


const checkContest = (roomId, name, socketid) => {
  let contestExist = false;
  let existingContest = null;
  let existingIndex = null;
  contests.every((contest, index) => {
    if (contest.Id === roomId) {
      contestExist = true; //Searching if contest already exist
      existingContest = contest;
      existingIndex = index;
      return false;
    }else{
      return true;
    }
  });

  let alreadyJoined = false;
  if(existingContest){
    existingContest.UsersId.every((user,index)=>{
      if(user === name){
        alreadyJoined = true;
        return false;
      }else{
        return true;
      }
    })
  }

  if (!contestExist) {
    return createContest(roomId, name, socketid);
  } else if (existingContest.length == 4) {
    return { error: "Room is Full", contest: null };
  } else if (existingContest.Started && !alreadyJoined) {
    return { error: "Contest has Already Started !", contest: null };
  } else if (
    contestExist &&
    existingContest.UsersId.length < 4
  ) {
    return joinContest(roomId, name, existingIndex, socketid, existingContest);
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
    Score:0,
    SocketId: socketid,
  };
  const startDate = new Date();

  const lockout = {
    contestIndex : contests.length,
    Id: roomId,
    Users: [user],
    UsersId: [name],
    EndTime: startDate.getTime() + 2*60*60*1000,
    Problems:[],
    Started: false,
    problemTags:[],
    minRating:0,
    maxRating:0,
    StartTime:startDate.getTime(),
    userToProblem:new Map()
  };
  contests.push(lockout);
  console.log("contest-created!");
  return { error: null, contest: lockout };
};

const joinContest = (
  roomId,
  name,
  existingIndex,
  socketid,
  existingContest
) => {
  let userExist = false,userIndex = -1;

  existingContest.UsersId.every((username, i) => {
    if (username === name) {
       userExist = true;
       userIndex = i;
       return false;
    }else{
      return true;
    }
  });

  if(userExist){ //Change the socket id of the user that joined again!
    console.log("contest already joined");
    contests[existingIndex].Users[userIndex].SocketId = socketid;
    return {error:null,contest:contests[existingIndex]};
  }

  const user = {
    Name: name,
    Score:0,
    SocketId: socketid,
  };

  contests[existingIndex].UsersId.push(name);
  contests[existingIndex].Users.push(user);

  console.log("Joined the existing contest");
  return { error: null, contest: contests[existingIndex] };
};

const removeContestUser = ({ contestIndex, name }) => {
  const userArray = [];
  const userIdArray = [];

  const contestUserIdArray = contests[contestIndex].UsersId;

  //creating new userid array
  contestUserIdArray.forEach((id, i) => {
    if (id !== name) {
      userIdArray.push(id);
    }
  });

  contests[contestIndex].UsersId = userIdArray;

  return contests[contestIndex];
};

const startContest = ({room,problemTags,
        minRating,maxRating,problemArray}) => {
  contests.every((cont, ind) => {
    if (cont.Id === room) {
      contestIndex = ind;
      contests[ind].Started = true; //Starting the contest
      return false;
    }else{
      return true;
    }
  });
  ////setting up problems////
  shuffleArray(problemArray);

  const problems = [];
  const problemLink = "https://codeforces.com/problemset/problem/";
  let problemCount = 0;
  problemArray.every((problem,i)=>{
      if(problem.rating >= parseInt(minRating) && problem.rating <= parseInt(maxRating)){
        const link = problemLink + problem.contestId + '/' + problem.index + '/';
        problems.push({
          key:i,
          link:link,
          name:problem.name,
          points:problem.rating});
        problemCount++;
        if(problemCount == 5)
          return false;

        return true;
      }else{
        return true;
      }
  })

  ////********/////////
  /////Setting up the contest////
  contests[contestIndex].Problems = problems;
  contests[contestIndex].problemTags = problemTags;
  contests[contestIndex].minRating = minRating;
  contests[contestIndex].maxRating = maxRating;
  /////***///////////

  console.log(contests[contestIndex])
  return contests[contestIndex];
};


const getTeamMembers = (userIds)=>{
  const newId = [];
  userIds.forEach((id) => {
    newId.push({username:id});
  });
  return newId;
}

const createURL = (problemTags)=>{
  let tags = "";
  problemTags.forEach((tag, i) => {
    if(i != 0){
      tags += ";" + tag.label;
    }else{
      tags += tag.label;
    }
  });
  const URL =  `https://codeforces.com/api/problemset.problems?tags=${tags}`;
  return URL;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const updateContest = async(roomId,contestIndex)=>{
  const contest = contests[contestIndex];
  const unsolvedProblems = [];

  contest.Problems.forEach((prob,i)=>{
    if(!contest.userToProblem.has(prob.name)){
      unsolvedProblems.push(prob.name);
    }
  });
  console.log(unsolvedProblems);

  const promise = await contest.UsersId.map(async(user,i)=>{
    const URL = `https://codeforces.com/api/user.status?handle=${user}&from=1&count=1`;
    const res = await axios.get(URL);
    unsolvedProblems.map((prob,j)=>{
       checkIfProblemSolved(user,prob,contestIndex,res.data.result);
    })
    return;
  })
  await Promise.all(promise);
  return(contests[contestIndex]);
}

const checkIfProblemSolved = (user,unsolvedProblem,contestIndex,arr)=>{
  // console.log(arr);
  arr.every((prob,i)=>{
    if(check(unsolvedProblem,prob)){
        if(contests[contestIndex].userToProblem.has(prob.problem.name) &&
                contests[contestIndex].userToProblem.get(prob.problem.name).time > prob.creationTimeSeconds ){
          contests[contestIndex].userToProblem.set(prob.problem.name,{time:prob.creationTimeSeconds,author:user})
        }else if(!contests[contestIndex].userToProblem.has(prob.problem.name)){
          contests[contestIndex].userToProblem.set(prob.problem.name,{time:prob.creationTimeSeconds,author:user})
        }else{
          console.log("eror")
        }
  })
}

const check = (unsolvedProblem,prob)=>{
  return(prob.problem.name.trim().toLowerCase() == unsolvedProblem.trim().toLowerCase()
   && prob.verdict == "OK")
  // prob.creationTimeSeconds >= contests[contestIndex].StartTime &&
  // prob.creationTimeSeconds <= contests[contestIndex].EndTime
}

const getContest=(roomId,contestIndex)=>{
  return(contests[contestIndex]);
}

module.exports = {
  checkContest: checkContest,
  removeContestUser: removeContestUser,
  startContest:startContest,
  getTeamMembers:getTeamMembers,
  createURL : createURL,
  updateContest:updateContest,
  getContest:getContest
};
