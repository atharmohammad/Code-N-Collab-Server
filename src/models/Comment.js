const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  Body:{
    type:String,
  },
  Blog:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Blog'
  },
  User:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  Like:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Likes',
    default:0
  }
},{
  timestamps:true
});


const table = mongoose.model('Comment',blogSchema);

module.exports = table
