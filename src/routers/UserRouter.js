const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const auth = require("../middleware/Auth");

router.post('/signup',async(req,res)=>{
  try{
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(200).send(newUser);
  }catch(e){
    res.status(400).send(e);
  }
})

router.post('/login',async(req,res)=>{
  try{
    const user = await User.findByCredentials(req.body.Email,req.body.Password)
    const token = await user.generateToken();
    res.status(200).send({user,token});
  }catch(e){
    res.status(400).send(e);
  }
});

router.get("/Me",auth,async(req,res,next)=>{
  try{
    const user = req.user;
    if(!user)
      res.status(404).send();

    res.status(200).send(user);
  }catch(e){
    res.status(400).send();
  }

})


module.exports = router;
