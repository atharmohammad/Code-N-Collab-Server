const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_DB_URL.toString(),
  { useNewUrlParser: true, useCreateIndex: true },
  (e, r) => {
    if (e) {
      return console.log("error", e);
    }
    console.log("connected");
  }
);
