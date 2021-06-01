const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  Body:{
    type:String,
    required:true
  },
  Blog:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Blog'
  },
  User:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  Likes:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
  }],
  Replies:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Reply',
      required:true
  }]
},{
  timestamps:true
});

commentSchema.pre("remove",async function(req,res,next){
  const comment = this;
  const commentId = comment._id.trim().toString();

  const blog = Blog.findOne({_id:comment.Blog});
  blog.Comments = blog.Comments.filter(curr=>curr.trim().toString() !== commentId);
  await blog.save();

  await Reply.deleteMany({Comment:commentId});

  next();

})


const table = mongoose.model('Comment',commentSchema);

module.exports = table
