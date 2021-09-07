const express = require("express");
const router = express.Router();
const { STATUS } = require("../../config");
const createResponse = require("../../utils/createReponse");
const { getInfo, getUserByKeyWord } = require("./feature");

router.get("/", async (req, res) => {
  const { id } = req.user;
  const user = await getInfo(id);
  res.send(createResponse(STATUS.SUCCESS, "Get user success", { user }));
});

router.get("/search", async (req, res) => {
  const { key } = req.query;
  const { id: myID } = req.user;
  const listUser = await getUserByKeyWord(key, myID);
  res.send(
    createResponse(STATUS.SUCCESS, "Get user success", {
      listUser,
    })
  );
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getInfo(id);

  res.send(
    createResponse(STATUS.SUCCESS, "Get user success", {
      user: { ...user, historyMess: [] },
    })
  );
});

module.exports = router;
