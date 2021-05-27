const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

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
    required:true,
    trim:true,
  },
  CodeforcesHandle:{
    type:String,
    trim:true,
    required:true,
  },
  tokens:[{
    token:{
      type:String,
      required:true,
    }
  }],
  Avatar:{
    type:Buffer
  }
},{
  timestamps:true
});


userSchema.methods.toJSON = function(){
  const user = this;
  const userObject = user.toObject();

  delete userObject.Password;
  delete userObject.tokens;

  return userObject;
}

userSchema.methods.generateToken = async function(){
  const user = this;
  const token = jwt.sign({_id:user._id.toString()},"Random-Secret");
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}

userSchema.statics.findByCredentials = async function(email,password){
  const user = await this.model("User").findOne({Email:email});
  if(!user)
    throw new Error("User does not exists");

  const isMatch = await bcrypt.compare(password,user.Password);

  if(!isMatch)
    throw new Error("Password is not correct");

  return user;
}

userSchema.pre('save',async function(next){
  const user = this;
  if(user.isModified('Password')){
    user.Password = await bcrypt.hash(user.Password,8) //Hash it 8 times
  }
  next();
})

// userSchema.pre("remove",async function(){
//
// })


const table = mongoose.model('User',userSchema);

module.exports = table
