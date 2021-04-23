const express = require('express');
const router = new express.Router();
const Blog = require('../models/Blogs');

router.get('/Allblogs',async(req,res)=>{
  try{
    const blogs = await Blog.find({});
    res.status(200).send(blogs);
  }catch(e){
      res.status(400).send(e);
  }
})

router.post('/write',async(req,res)=>{
  try{
    const blog = new Blog(req.body);
    const newBlog = await blog.save();
    res.status(200).send(newBlog);
  }catch(e){
    res.status(400).send(e);
  }
})


module.exports = router
