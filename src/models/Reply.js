const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  Body:{
    type:String,
  },
  Comment:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Comment'
  },
  Blog:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Blog'
  },
  User:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Users"
  },
  Like:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Likes",
    default:0
  }
},{
  timestamps:true
});


const table = mongoose.model('Reply',blogSchema);

module.exports = table
