const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  Name:{
    type:String,
    trim:true,
    required:true,
  },
  Email:{
    type:String,
    trim:true,
    unique:true,
    validate:(value)=>{
      if(!validator.isEmail(value))
        throw new Error("Email is not valid !")
    }
  },
  Password:{
    type:String,
    trim:true,
  },
  CodeforcesHandle:{
    type:String,
    trim:true,
    default:null
  },
  Designation:{
    type:String,
    trim:true,
  },
  Deleted:{
    type:Boolean,
    default:false
  },
  Blogs:[{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Blog"
  }],
  token:{
      type:String,
  },
  Avatar:{
    type:String,
    default:'amongus1'
  },
  Verified:{
    type:Boolean,
    default:false
  },
  Moto:{
    type:String,
    default:""
  },
  Country:{
    type:String,
    default:"",
  },
  Linkedin:{
    type:String,
    default:null
  },
  Github:{
    type:String,
    default:null
  },
  Codeforces:{
    type:String,
    default:null
  },
  Codechef:{
    type:String,
    default:null
  },
  AtCoder:{
    type:String,
    default:null
  },
  SuperUser:{
    type:Boolean,
    default:false
  },
},{
  timestamps:true
});


userSchema.methods.toJSON = function(){
  const user = this;
  const userObject = user.toObject();

  delete userObject.Password;
  delete userObject.token;
  delete userObject.Blogs;
  delete userObject.Verified;
  delete userObject.Deleted;

  return userObject;
}

userSchema.methods.generateToken = async function(){
  const user = this;
  const token = jwt.sign({_id:user._id.toString()},"Random-Secret");
  user.token = token;
  await user.save();
  return token;
}

userSchema.statics.findByCredentials = async function(email,password){
  const user = await this.model("User").findOne({Email:email,Deleted:false});
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

const table = mongoose.model('User',userSchema);

module.exports = table
