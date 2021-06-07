const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_DB_URL,
  { useNewUrlParser: true, useCreateIndex: true },
  (e, r) => {
    if (e) {
      return console.log("error", e);
    }
    console.log("connected");
  }
);
