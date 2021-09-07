const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Message",
  new mongoose.Schema({
    room: { type: mongoose.ObjectId, ref: "Room", required: true },
    sender: { type: mongoose.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.ObjectId, ref: "User", required: true },
    message: { type: String, default: "", required: true },
    type: { type: String, default: "text", required: true },
    read: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  })
);

// Type
//  |- text
//  |- image
//  |- file
