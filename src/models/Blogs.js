const mongoose = require("mongoose");
const validator = require("validator");
const Comment = require("./Comment");
const User = require("./User");

const blogSchema = new mongoose.Schema(
  {
    Body: {
      type: String,
      required: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Deleted: {
      type: Boolean,
      default: false,
    },
    Likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    Comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const table = mongoose.model("Blog", blogSchema);

module.exports = table;
