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
    SocketId: socketid,
  };
  const lockout = {
    Id: roomId,
    Users: [user],
    UsersId: [name],
    EndTime: "2hrs",
    Problems:[],
    Started: false,
    problemTags:[],
    minRating:0,
    maxRating:0
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
    SocketId: socketid,
  };

  contests[existingIndex].UsersId.push(name);
  contests[existingIndex].Users.push(user);

  console.log("Joined the existing contest");
  return { error: null, contest: contests[existingIndex] };
};

const removeContestUser = ({ room, name }) => {
  const userArray = [];
  const userIdArray = [];
  let contestIndex = -1;

  contests.every((contest, i) => {
    if(contest.Id === room){
      contestIndex = i;
      return false;
    }else{
      return true;
    }
  });

  const contestUserArray = contests[contestIndex].Users;
  const contestUserIdArray = contests[contestIndex].UsersId;

  contestUserArray.forEach((user, i) => {
    //creating new user Array
    if (user.Name !== name) {
      userArray.push(user);
    }
  });

  //creating new userid array
  contestUserIdArray.forEach((id, i) => {
    if (id !== name) {
      userIdArray.push(id);
    }
  });

  contests[contestIndex].Users = userArray;
  contests[contestIndex].UsersId = userIdArray;

  return contests[contestIndex];
};

const startContest = ({room,problemTags,
        minRating,maxRating,problems}) => {
  contests.every((cont, ind) => {
    if (cont.Id === room) {
      contestIndex = ind;
      contests[ind].Started = true; //Starting the contest
      return false;
    }else{
      return true;
    }
  });
  /////Setting up the contest////
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

module.exports = {
  checkContest: checkContest,
  removeContestUser: removeContestUser,
  startContest:startContest,
  getTeamMembers:getTeamMembers,
  createURL : createURL
};
