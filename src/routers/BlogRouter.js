const express = require('express');
const router = new express.Router();
const Blog = require('../models/Blogs');
const auth = require("../middleware/Auth");

router.get('/Allblogs',async(req,res)=>{
  try{
    const blogs = await Blog.find({}).populate({
      path:"User",
      select:"Name",
      sort:{"createdAt":"desc"}
    }).exec();
    res.status(200).send(blogs);
  }catch(e){
      res.status(400).send(e);
  }
})

router.post('/write',auth,async(req,res)=>{
  try{
    const blog = new Blog({Body:req.body.Body,User:req.user._id});
    const newBlog = await blog.save();
    res.status(200).send(newBlog);
  }catch(e){
    res.status(400).send(e);
  }
})

router.delete('/delete/:id',async(req,res)=>{
  try{
    const _id = req.params.id;
    const blog = await Blog.findOneAndDelete({_id});
    if(!blog)
      res.status(404).send()

    res.status(200).send(blog)
  }catch(e){
    return res.status(400).send(e);
  }
})




module.exports = router
