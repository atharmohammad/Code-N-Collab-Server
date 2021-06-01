const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  Body:{
    type:String,
  },
  User:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
  },
  Comment:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Comment"
  },
  Likes:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
  }],
},{
  timestamps:true
});

replySchema.pre("remove",async function(req,res,next){
  const reply = this;
  const replyId = reply._id.trim().toString();

  const comment = await Comment.findOne({_id:reply.Comment});
  comment.Replies = comment.Replies.filter(curr => curr.trim().toString() !== replyId);
  await comment.save();

  next();

})


const table = mongoose.model('Reply',replySchema);

module.exports = table
