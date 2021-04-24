const mongoose = require('mongoose');
const validator = require('validator');

const blogSchema = new mongoose.Schema({
  Body:{
    type:String,
    required:true
  },
  User:{
    type:mongoose.Schema.Types.ObjectId,
    // required:true,
    ref:'User'
  }
},{
  timestamps:true
});


const table = mongoose.model('Blog',blogSchema);

module.exports = table
