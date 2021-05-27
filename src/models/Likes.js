const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  Count:{
    type:Number,
    required:true,
    default:0
  },
  Comment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Comment'
  },
  Reply:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Reply'
  },
  Blog:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Blog'
  },
  User:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

module.exports = mongoose.model("Likes",likesSchema);
