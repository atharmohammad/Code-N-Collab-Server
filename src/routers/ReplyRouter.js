const express = require("express");
const router = new express.Router();

const Reply = require("../models/Reply");
const Comments = require("../models/Comment");

const auth = require("../middleware/Auth");

router.post("/newReply/:id",auth,async(req,res)=>{
  try{
    const reply = new Reply({
      Body:req.body.Body,
      User:req.user._id,
      Comment:req.params.id
    });
    const comment = await Comments.findOne({_id:req.params.id,Deleted:false});
    if(!comment)
      res.status(404).send();

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
    const comment = await Comments.findOne({_id:req.params.id,Deleted:false});
    if(!comment)
      res.status(400).send();

    const replies = await comment.populate({
      path:"Replies",
      model:"Reply",
      match:{Deleted:false},
      populate:{path:"User",select:"Name"},
      options:{
        limit:parseInt(req.params.limit),
      }
    }).exec();

    res.status(200).send(replies);

  }catch(e){
    res.status(400).send();
  }
})

router.post("/likeReply/:id",auth,async(req,res)=>{
  try{
    const reply = await Reply.findOne({_id:req.params.id,Deleted:false});
    if(!reply)
      res.status(404).send();

      const like = reply.Likes.find((curr)=>{
        return(curr.toString().trim() == req.user._id.toString().trim());
      });

      if(like){
        const likeArray = reply.Likes.filter((curr)=>curr.toString().trim() != req.user._id.toString().trim());
        reply.Likes = likeArray;
      }else{
        reply.Likes.push(req.user._id);
      }
    const newReply = await reply.save();
    res.status(200).send(newReply);
  }catch(e){
    res.status(400).send();
  }
});

router.delete("/deleteReply/:id",auth,async(req,res)=>{
  const id = req.params._id;

  try{
    const reply = await Reply.findOne({_id:id,Deleted:false});
    if(!reply)
      res.status(404).send();

    reply.Deleted = true;
    await reply.save();
    res.status(200).send();
  }catch(e){
    res.status(400).send();
  }
});

router.patch("/updateReply/:id",auth,async(req,res)=>{
  const id = req.params.id;

  try{
    const reply = Reply.findOne({_id:id,Deleted:false});

    if(!reply){
      res.status(404).send();
    }

    reply.Body = req.body.Body;
    await reply.save();
    res.status(200).send(reply);
  }catch(e){
    res.status(400).send();
  }

})


module.exports = router