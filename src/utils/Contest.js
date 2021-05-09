const contests = []; //contains all contests

const checkContest = (roomId,name,socketid)=>{
  let contestExist = false;
  let existingContest = null;
  let existingIndex = null;
    contests.forEach((contest,index)=> {
      if(contest.Id === roomId){
        contestExist = true; //Searching if contest already exist
        existingContest = contest;
        existingIndex = index;
      }
    });

    if(!contestExist){
      return createContest(roomId,name,socketid);
    }else if(existingContest.length == 4){
      return {error:"Room is Full",contest:null};
    }else if(existingContest.started){
      return {error:"Contest has Already Started !",contest:null}
    }else if(contestExist && !existingContest.Started &&
                                existingContest.UsersId.length < 4){
      return joinContest(roomId,name,existingIndex,socketid,existingContest);
    }else{
      return{error:"There might be an error! Please Try again !",contest:null}
    }
}

const createContest = (roomId,name,socketid)=>{
  const user = {
    Name:name,
    Problems:[],
    SocketId:socketid
  }
  const lockout = {
    Id:roomId,
    Users:[user],
    UsersId:[name],
    EndTime:"2hrs",
    Started:false
  };
  contests.push(lockout);
  console.log("contest-created!");
  return {error:null,contest:lockout};
}

const joinContest = (roomId,name,existingIndex,socketid,existingContest)=>{
  existingContest.UsersId.forEach((username, i) => {
    if(username === name){
      console.log("contest already joined")
      return {error:null,contest:existingContest};
    }
  });

  const user = {
    Name:name,
    Problems:[],
    SocketId:socketid
  }

  contests[existingIndex].UsersId.push(name);
  contests[existingIndex].Users.push(user);

  console.log("Joined the existing contest");
  return {error:null,contest:contests[existingIndex]};
}

const removeContestUser = ({room,name})=>{
  const userArray = [];
  const userIdArray = [];

  const contestUserArray = contests[room].Users;
  const contestUserIdArray = contests[room].UsersId;

  contestUserArray.forEach((user,i)=>{ //creating new user Array
    if(user.Name !== name){
      userArray.push(user);
    }
  });

  //creating new userid array
  contestUserIdArray.forEach((id, i) => {
    if(id !== name){
      userIdArray.push(id);
    }
  });

  contests[room].Users = userArray;
  contests[room].UsersId = userIdArray;

}

module.exports = {checkContest:checkContest,removeContestUser:removeContestUser};
