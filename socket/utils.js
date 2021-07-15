const jwt = require("jsonwebtoken");
const _ = require("underscore");
const { JWT_TOKEN } = require("../config");

const checkAuthSocket = (token, callback) => {
  try {
    const decode = jwt.verify(token, JWT_TOKEN);
    if (decode.exp < Math.floor(new Date().getTime() / 1000))
      throw new Error("Token expired");

    callback(null, decode);
  } catch (e) {
    callback(e, null);
  }
};

const lockSocket = (io) => {
  _.each(io.nsps, (nsp) => {
    nsp.on("connect", (socket) => {
      if (!socket.auth) {
        console.log(`[${TAG_LOG}]: Removing socket from ${nsp.name}`);
        delete nsp.connected[socket.id];
      }
    });
  });
};

const unlockSocket = (io, socketID) => {
  _.each(io.nsps, (nsp) => {
    if (_.findWhere(nsp.sockets, { id: socketID })) {
      console.log(`[${TAG_LOG}]: Restoring socket to ${nsp.name}`);
      nsp.connected[socketID] = socket;
    }
  });
};

const log = (tag, message) => {
  console.log(`[${tag}]: ${message}`);
};

module.exports = { checkAuthSocket, lockSocket, unlockSocket, log };
