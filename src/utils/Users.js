const passwordList = [];
const users = [];

const addUser = ({id, username, room, password })=> {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    password = password.trim()
    
    if(!username || !room){
        return {
            error:'Username and room are required'
        }
    }

    const existingUser = users.find((user)=> {
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            error:"Username is in use!"
        }
    }
    
    const roomPassword = passwordList.find((roomPassword)=> {
        return roomPassword.room === room;
    })
    
    if(roomPassword){
      if(roomPassword.password !== password)
        return {error:"Password did not matched"};
    }else{
      const p = {room, password};
      passwordList.push(p);
    }

    const user = {id, username, room}
    users.push(user)
    return { user }
}


const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}


const getUser = (id) => {
    return users.find((user)=>user.id === id)
}

const getUsersInRoom = (room) =>{
    return users.filter((user)=>user.room === room)
}

const removePassword = (room)=>{
    const index = passwordList.findIndex((roomPassword)=> roomPassword.room === room)

    if(index !== -1){
        return passwordList.splice(index,1)[0];
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    removePassword,
}
