const mongoose = require('mongoose');
const validator = require('validator');
const Comment = require("./Comment");
const User = require("./User");

const blogSchema = new mongoose.Schema({
  Body:{
    type:String,
    required:true
  },
  User:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  Likes:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
  }],
  Comments:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Comment",
      required:true
  }],
},{
  timestamps:true
});

blogSchema.pre("remove",async function(req,res,next){
  const blog = this;
  const blogId = blod._id.trim().toString();

  const user = await User.findOne({_id:req.user._id});
  user.Blogs = user.Blogs.filter(curr=>curr.trim().toString() !== blogId);
  await user.save();

  await Comment.deleteMany({Blog:blogId});

  next();

})


const table = mongoose.model('Blog',blogSchema);

module.exports = table
