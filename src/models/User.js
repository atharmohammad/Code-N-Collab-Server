const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  Name:{
    type:String,
    trim:true,
    required:true
  },
  Email:{
    type:String,
    trim:true,
    unique:true,
    required:true,
    validate:(value)=>{
      if(!validator.isEmail(value))
        throw new Error("Email is not valid !")
    }
  },
  Password:{
    type:String,
    trim:true,
    validate:(value)=>{
      //validate the Password
    },
  },
  CodeforcesHandle:{
    type:String,
    trim:true,
    // required:true,
    unique:true
  },
  tokens:{
    type:String,
  },
  Avatar:{
    type:Buffer
  }
},{
  timestamps:true
});


userschema.pre('save',async function(next){
  const user = this;
  if(user.isModified('Password')){
    user.Password = await bcrypt.hash(user.Password,8) //Hash it 8 times
  }
  next();
})


const table = mongoose.model('User',userSchema);

module.exports = table
