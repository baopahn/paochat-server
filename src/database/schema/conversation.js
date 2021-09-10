const mongoose = require("mongoose");
const getCurrentDate = require("../../utils/getDateNow");

module.exports = mongoose.model(
  "Conversation",
  new mongoose.Schema({
    listUsers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        default: null,
      },
    ],
    createdAt: { type: Date, default: getCurrentDate },
  })
);
