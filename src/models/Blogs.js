const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const blogSchema = new mongoose.Schema({
  Title:{
    type:String,
    trim:true,
    required:true
  },
  Description:{
    type:String,
    trim:true
  },
  Body:{
    type:String,
  },
},{
  timestamps:true
});


const table = mongoose.model('Blog',blogSchema);

module.exports = table
