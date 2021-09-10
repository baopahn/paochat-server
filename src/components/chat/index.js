const express = require("express");
const router = express.Router();
const { STATUS } = require("../../config");
const createResponse = require("../../utils/createReponse");
const { getConversation } = require("./feature");

router.get("/", async (req, res) => {
  const { friendID } = req.query;
  const { id: myID } = req.user;

  const conversation = await getConversation(myID, friendID);
  res.send(
    createResponse(STATUS.SUCCESS, "get conversation success", conversation)
  );
});

module.exports = router;
