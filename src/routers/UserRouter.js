const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const auth = require("../middleware/Auth");
const jwt = require("jsonwebtoken");
const cryptoRandomString  = require("crypto-random-string");
const sendMessage = require("../Function/Sender");

router.post('/signup',async(req,res)=>{
  try{
    const password = req.body.Password;
    if(!password || password.toString().trim().length < 6){
      res.status(400).send("error : Password is either weak or empty");
      return;
    }
      const _token = cryptoRandomString(128);

      const user = new User({...req.body,VerificationToken:_token});
      const newUser = await user.save();

      const data = {
        _id:newUser._id.toString().trim(),
        token:_token
      }

      const ciphertext = jwt.sign(data,'Random-Secret',{ expiresIn: '1h' });
      const verificationLink = `${process.env.BaseURI}user/verify/${ciphertext}`;

      await sendMessage(user.Email,verificationLink);

      res.status(200).send(newUser);
  }catch(e){
    console.log(e);
    res.status(400).send(e);
  }
});

router.get("/verify/:token",async(req,res)=>{
  const token = req.params.token;
  try{
      const decodedKey = jwt.verify(token,"Random-Secret");
      const id = decodedKey._id;
      const user = await User.findOne({_id:id,Deleted:false});
      if(!user){
        res.status(404).send({"error":"user does not exist"});
      }

      if(user.Verified){
        res.status(400).send({"error":"User is already verified"});
      }

      if(user.VerificationToken.token.String().trim() !== decodedKey.token.toString().trim()){
        res.status(400).send({"error":"there might be a problem ! Please Click resend to recieve a verification link !"});
      }

      res.status(200).send({"success":"Email has been verified!"})

  }catch(e){
    res.status(400).send({"error":"Please click on resend button to recieve a verification link!"})
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
