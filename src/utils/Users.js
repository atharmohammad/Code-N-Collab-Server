//Maintaining a list of passwords for room and users

const passwordList = [];
const users = [];

//Adding users in a room 
const addUser = ({ id, username, room, password }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  password = password.trim();

  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //No two user can have same name
  if (existingUser) {
    return {
      error: "Username is in use! Choose some other name",
    };
  }

  const roomPassword = passwordList.find((roomPassword) => {
    return roomPassword.room === room;
  });

  //Validating the room password

  if (roomPassword) {
    if (roomPassword.password !== password)
      return { error: "Password did not match !" };
  } else {
    const p = { room, password };
    passwordList.push(p);
  }

  //Updating the users list
  const user = { id, username, room };
  users.push(user);
  return { user };
};

//removing the user by filtering the user id 
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  } else {
    return null;
  }
};

//returns a user
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

//Returning a list of users
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

//removing the password from the list
const removePassword = (room) => {
  const index = passwordList.findIndex(
    (roomPassword) => roomPassword.room === room
  );

  if (index !== -1) {
    return passwordList.splice(index, 1)[0];
  }
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  removePassword,
};
