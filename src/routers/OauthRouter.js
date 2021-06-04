const express = require("express");
const router =  new express.Router();
const {google} = require("googleapis");
const {getAuthUrl,getGoogleUser} = require("../Function/Oauth2");
const User = require("../models/User");
const {sendMessage} = require("../Function/Sender");

global.oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.redirect_URI
);

router.get("/googleOauth",async(req,res)=>{
  try{
    const authUrl = getAuthUrl();
    res.status(200).send(authUrl)
  }catch(e){
    console.log(e);
    res.status(400).send();
  }

});

router.post("/authenticated",async(req,res)=>{
  const code = req.body.code;
  console.log(req.body)
  if(!code){
   return res.status(400).send({"error":"There is a problem ! Please try again later"});
 }

 try{
   const { tokens } = await oauth2Client.getToken(code);
   const user = await getGoogleUser(tokens);
   const isUser = await User.findOne({Email:user.email,Verified:true});
   if(isUser){
     if(isUser.Deleted){
       isUser.Deleted = false;
       await isUser.save();
     }
     const token = await isUser.generateToken();
     return res.status(200).send({user:isUser,token:token});
   }
  const newUser = new User({
    Name:user.name,
    Email:user.email,
    Verified:user.verified_email
  });

  const _Guser = await newUser.save();
  const token = await _Guser.generateToken();

  return res.status(200).send({user:_Guser,token:token});
 }catch(e){
   res.status(400).send()
 }

})

module.exports = router
