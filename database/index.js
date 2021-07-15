const mongoose = require("mongoose");
const { MONGO_DB_URL } = require("../config");

const userModel = require("./schema/user");
const roomModel = require("./schema/room");
const messageModel = require("./schema/message");

const connectDB = () => {
  mongoose.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection
    .once("open", () => console.log("Database connection is successful!!"))
    .on("error", () => console.log("Database connection is failed!!"));
};

module.exports = { connectDB, userModel, roomModel, messageModel };
