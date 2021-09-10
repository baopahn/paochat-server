const mongoose = require("mongoose");
const getCurrentDate = require("../../utils/getDateNow");

module.exports = mongoose.model(
  "Message",
  new mongoose.Schema({
    roomID: { type: mongoose.ObjectId, ref: "Conversation", required: true },
    fromUid: { type: mongoose.ObjectId, ref: "User", required: true },
    toUid: { type: mongoose.ObjectId, ref: "User", required: true },
    message: { type: String, default: "", required: true },
    type: { type: String, default: "text", required: true },
    status: { type: String, default: "sending", required: true },
    reply: { type: mongoose.ObjectId, ref: "Message", required: true },
    createdAt: { type: Number, default: getCurrentDate },
  })
);

// Type
//  |- text
//  |- image
//  |- file
