const mongoose = require("mongoose");
const getCurrentDate = require("../../utils/getDateNow");

module.exports = mongoose.model(
  "User",
  new mongoose.Schema({
    fullName: { type: String, default: "", required: true },
    email: { type: String, default: "", required: true },
    avatar: { type: String, default: "", required: true },
    refreshToken: { type: String, default: "" },
    createdAt: { type: Date, default: getCurrentDate },
  })
);
