const mongoose = require('mongoose');
const URL = require('../../Configs/db');

mongoose.connect(URL,{useNewUrlParser:true,useCreateIndex:true},(e,r)=>{
  if(e)
    return console.log('error',e)

  console.log('connected');
})
