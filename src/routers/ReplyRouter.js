const express = require("express");
const router = new express.Router();

const Reply = require("../models/Reply");
const Comments = require(".../models/Comments");

const auth = require("../middleware/Auth");

router.post("/newReply/:id",auth,async(req,res)=>{
  try{
    const reply = new Reply({
      Body:req.body.Body,
      User:req.user._id,
      Comment:req.id
    });
    const comment = await Comments.findOne({_id:req.id});
    const newReply = await reply.save();
    comment.push(newReply._id);
    await comment.save();
    res.status(200).send(newReply);
  }catch(e){
    res.status(400).send();
  }
})

router.get("/getReply/:id",async(req,res)=>{
  try{
    const comment = await Comments.findOne({_id:req.id});
    if(!comment)
      res.status(400).send();

    const replies = await comment.populate({
      path:"Replies",
      options:{
        limit:parseInt(req.params.limit),
      }
    }).execPopulate();

    res.status(200).send(replies);

  }catch(e){
    res.status(400).send();
  }
})

router.post("/likeReply/:id",auth,async(req,res)=>{
  try{
    const reply = await Reply.findOne({_id:req.id});
    reply.Likes.push(req.user._id);
    res.status(200).send();
  }catch(e){
    res.status(400).send();
  }
})

module.exports = router
