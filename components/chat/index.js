const express = require("express");
const router = express.Router();
const { STATUS } = require("../../config");
const createResponse = require("../../utils/createReponse");
const { getHistoryMessage, getHistoryChat, getChatRoom } = require("./feature");

router.get("/", async (req, res) => {
  const { id } = req.user;
  const historyChat = await getHistoryChat(id);

  res.send(createResponse(STATUS.SUCCESS, "get chat success", { historyChat }));
});

router.get("/room", async (req, res) => {
  const { friendID } = req.query;
  const { id: myID } = req.user;

  const roomChat = await getChatRoom(myID, friendID);
  res.send(createResponse(STATUS.SUCCESS, "get chat success", { roomChat }));
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { page = 1 } = req.query;
  const { id: myID } = req.user;

  const { listMess, friend } = await getHistoryMessage(id, myID, page);

  res.send(
    createResponse(STATUS.SUCCESS, "get chat success", { listMess, friend })
  );
});

module.exports = router;
