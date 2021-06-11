const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    Body: {
      type: String,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Comment: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Comment",
    },
    Likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    Deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const table = mongoose.model("Reply", replySchema);

module.exports = table;
