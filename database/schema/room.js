const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Room",
  new mongoose.Schema({
    firstUser: { type: mongoose.ObjectId, ref: "User", required: true },
    secondUser: { type: mongoose.ObjectId, ref: "User", required: true },
    lastMessage: { type: mongoose.ObjectId, ref: "Message", default: null },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  })
);
