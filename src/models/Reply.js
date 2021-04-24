const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  Body:{
    type:String,
  },
  Comment:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Comment'
  }
},{
  timestamps:true
});


const table = mongoose.model('Reply',blogSchema);

module.exports = table
