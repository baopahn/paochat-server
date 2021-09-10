const mongoose = require("mongoose");
const { MONGO_DB_URL } = require("../config");

const userModel = require("./schema/user");
const conversationModel = require("./schema/conversation");
const messageModel = require("./schema/message");

const connectDB = async () => {
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose
    .connect(MONGO_DB_URL, options)
    .catch((e) => console.log("Database connection is failed!!"));

  mongoose.connection.once("open", () =>
    console.log("Database connection is successful!!")
  );
};

module.exports = { connectDB, userModel, conversationModel, messageModel };
