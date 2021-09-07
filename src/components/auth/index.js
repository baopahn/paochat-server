const express = require("express");
const { STATUS } = require("../../config");
const router = express.Router();
const createResponse = require("../../utils/createReponse");
const { signIn, signOut, renewToken } = require("./feature");

router.post("/sign-in", async (req, res) => {
  const { tokenID } = req.body;
  const { token, refreshToken } = await signIn(tokenID);
  res.send(
    createResponse(STATUS.SUCCESS, "Sign in success", { token, refreshToken })
  );
});

router.post("/sign-out", async (req, res) => {
  const { refreshToken } = req.body;
  await signOut(refreshToken);
  res.send(createResponse(STATUS.SUCCESS, "Sign out success", {}));
});

router.post("/renew", async (req, res) => {
  const { refreshToken: refreshTokenOld } = req.body;
  const { token, refreshToken } = await renewToken(refreshTokenOld);
  res.send(
    createResponse(STATUS.SUCCESS, "Sign in success", { token, refreshToken })
  );
});

module.exports = router;
