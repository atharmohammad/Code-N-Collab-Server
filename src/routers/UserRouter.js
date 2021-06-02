const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const auth = require("../middleware/Auth");
const CryptoJS = require("crypto-js");
const cryptoRandomString  = require("crypto-random-string");
const sendMessage = require("../Function/Sender");

router.post('/signup',async(req,res)=>{
  try{
    const password = req.body.Password;
    if(!password || password.toString().trim().length < 6){
      res.status(400).send("error : Password is either weak or empty");
      return;
    }
      const _token = cryptoRandomString({length: 128})

      const user = new User({...req.body,VerificationToken:_token});
      const newUser = await user.save();

      const data = {
        _id:newUser._id.toString().trim(),
        token:_token;
      }

      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data),'Random-Secret').toString();
      const verificationLink = `${process.env.BaseURI}?verify=${ciphertext}`;

      await sendMessage(user.Email,verificationLink);

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
