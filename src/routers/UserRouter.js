const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const auth = require("../middleware/Auth");
const jwt = require("jsonwebtoken");
const cryptoRandomString  = require("crypto-random-string");
const sendMessage = require("../Function/Sender");

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


router.patch("/updateProfile",auth,async(req,res)=>{

  const updates = Object.keys(req.body);
  const requiredUpdate = ['Name','CodeforcesHandle',
                          "Designation","Password","Avatar","Moto",
                          "Country","Linkedin","Github","Codeforces",
                          "Codechef","AtCoder",];
  const allUpdates = updates.every(update=>requiredUpdate.includes(update))
  if(!allUpdates){
    return res.status(400).send({error:"Invalid updates!"});
  }
  try{

    updates.forEach(update=>req.user[update] = req.body[update])
    await req.user.save();

    res.status(200).send(req.user);
  }catch(e){
    res.status(400).send(e);
  }

})

router.delete("/deleteUser",auth,async(req,res)=>{
  try{
      req.user.Deleted = true;
      await req.user.save();
      res.status(200).send()
  }catch(e){
    res.status(400).send({"error":"there is some error , user cannot be deleted !"});
  }

})


module.exports = router;
