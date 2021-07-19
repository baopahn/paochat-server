const axios = require("axios");
const utilTry = require("../../utils/utilTry");
const { userModel } = require("../../database");
const signToken = require("../../utils/signToken");
const { GG_GET_USER } = require("../../config");

const signIn = async (tokenID) => {
  const URL_GG = GG_GET_USER.replace("TOKEN_ID", tokenID);
  const respose = await utilTry(axios.get(URL_GG), "SIGN_IN");
  const userInfo = respose.data;
  const { email, name: fullName, picture } = userInfo;
  const avatar = picture.replace("s96-c", "s800-c");

  let user = await utilTry(userModel.findOne({ email }), "SIGN_IN");
  if (!user) {
    user = new userModel({ email, fullName, avatar });
  } else {
    user.avatar = avatar;
    user.fullName = fullName;
  }

  const token = signToken({ id: user._id, email, fullName });
  user.refreshToken = token.refreshToken;
  await utilTry(user.save(), "SIGN_IN");

  return token;
};

const signOut = async (refreshToken) => {
  const user = await utilTry(
    userModel.findOne({ refreshToken }),
    "RENEW_TOKEN"
  );
  if (!user) return;

  user.refreshToken = null;
  await utilTry(user.save(), "RENEW_TOKEN");
};

const renewToken = async (refreshToken) => {
  const user = await utilTry(
    userModel.findOne({ refreshToken }),
    "RENEW_TOKEN"
  );
  if (!user) return { token: null, refreshToken: null };

  const token = signToken({
    id: user._id,
    email: user.email,
    fullName: user.fullName,
  });

  user.refreshToken = token.refreshToken;
  await utilTry(user.save(), "RENEW_TOKEN");

  return token;
};

module.exports = { signIn, signOut, renewToken };
