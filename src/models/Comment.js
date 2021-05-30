const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  Body:{
    type:String,
    required:true
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
  Likes:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
  }],
  Replies:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Reply',
      required:true
  }]
},{
  timestamps:true
});


const table = mongoose.model('Comment',commentSchema);

module.exports = table
