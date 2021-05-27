const mongoose = require('mongoose');
const validator = require('validator');

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
  Like:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Likes",
    default:0,
  },
  Comment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Comment"
  },
},{
  timestamps:true
});


const table = mongoose.model('Blog',blogSchema);

module.exports = table
