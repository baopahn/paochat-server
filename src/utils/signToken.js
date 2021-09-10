const jwt = require("jsonwebtoken");
const { JWT_TOKEN, TIME_EXPIRED, JWT_REFRESH_TOKEN } = require("../config");

const signToken = (userInfo) => {
  const token = jwt.sign(userInfo, JWT_TOKEN, {
    expiresIn: TIME_EXPIRED,
  });

  const refreshToken = jwt.sign(userInfo, JWT_REFRESH_TOKEN);
  return { token, refreshToken };
};

module.exports = signToken;
