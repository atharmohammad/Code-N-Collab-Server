const express = require("express");
const router = new express.Router();
const Comments = require("../models/Comment");
const Blogs = require('../models/Blogs');
const auth = require('../middleware/Auth');

router.get("/getComments/:id",async(req,res)=>{
  const id = req.id;
  try{
    const blog = await Blogs.findOne({_id:id});

    if(!blog)
      throw new Error();

      const comments = blog.populate({
        path:"Comments",
        select:["Body","Likes","User"],
        options:{
          limit:parseInt(req.params.limit),
        }
      }).execPopulate();

      res.status(200).send(comments);
  }catch(e){
    res.status(404).send();
  }
});


router.post("/createComment/:id",auth,async(req,res)=>{
  try{
    const comment = new Comments({
      Body:req.body,
      User:req.user._id,
      Blog:req.id
    });
    const newComment = await comment.save();
    res.status(200).send();
  }catch(e){
    res.status(400).send();
  }
});

router.post("/likeRouter/:id",auth,async(req,res)=>{
  try{
    const comment = await Comments.findOne({_id:req.id});
    if(!comment)
      throw new Error();

    comment.Likes.push(req.user._id);
    await comment.save();

    res.status(200).send(comment);
  }catch(e){
    res.status(400).send();
  }
})

module.exports = router;
