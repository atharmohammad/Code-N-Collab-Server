const express = require('express');
const router = new express.Router();
const User = require('../models/User');

router.post('/createUser',async(req,res)=>{
  try{
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(200).send(newUser);
  }catch(e){
    res.status(400).send(e);
  }
})

router.get('/Allusers',async(req,res)=>{
  try{
    const user = await User.find({});
    res.status(200).send(user);
  }catch(e){
    res.status(400).send(e);
  }
})


module.exports = router;
