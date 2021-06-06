const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const auth = require("../middleware/Auth");
const jwt = require("jsonwebtoken");

router.get("/Me",auth,async(req,res,next)=>{
  try{
    const user = req.user;
    if(!user)
      res.status(404).send();

    res.status(200).send(user);
  }catch(e){
    res.status(400).send();
  }

});

router.get("userProfile/:id",async(req,res)=>{
  const id = req.params.id;
  try{
      const user = await User.findOne({_id:id,Deleted:false});
      if(!user){
        return res.status(404).send({error:"User not found !"});
      }

      return res.status(200).send(user);

  }catch(e){
    res.status(400).send();
  }

})


router.patch("/updateProfile",auth,async(req,res)=>{

  const updates = Object.keys(req.body);
  const requiredUpdate = ['Name','CodeforcesHandle',
                          "Designation","Password","Avatar","Moto",
                          "Country","Linkedin","Github","Codeforces",
                          "Codechef","AtCoder","Institution"];
  const allUpdates = updates.every(update=>requiredUpdate.includes(update))
  if(!allUpdates){
    console.log(updates)
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

router.get("/logout",auth,async(req,res)=>{
  try{
    req.user.token = null;
    req.token = null;
    await req.user.save();
    res.status(200).send();
  }catch(e){
    res.status(400).send();
  }
})


module.exports = router;
