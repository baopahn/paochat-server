const socketIO = require("socket.io");
const { checkAuthSocket, unlockSocket, lockSocket, log } = require("./utils");
const { BASE_URL_CLIENT } = require("../config");
const { configEventListener } = require("./eventListener");
const userController = require("./userController");
const chatController = require("./chatController");

// Storage io
let io = null;
const TAG = "SOCKET";

// Config socket server
const configSocket = (server) => {
  if (io !== null) return;

  io = socketIO(server, {
    cors: true,
    origins: [`${BASE_URL_CLIENT}`],
  });

  userController.setIO(io);
  chatController.setIO(io);

  io.on("connection", setUpNewConnection);
  lockSocket(io);

  log(TAG, `Config socket.io success`);
};

// Setup for each connection
const setUpNewConnection = (socket) => {
  const callbackAuth = (err, decode) => {
    if (!err && decode) {
      log(TAG, `Authenticated socket ${socket.id}`);
      socket.auth = true;
      socket.decode = decode;
      unlockSocket(io, socket.id);
      configEventListener(socket);
      socket.emit("authenticated", "Authenticated");
      userController.addUserSocket(decode.id, socket.id);
    } else {
      socket.emit("unauthenticated", err.message);
      log(TAG, `${err.message}`);
    }
  };

  socket.auth = false;
  socket.on("authenticate", (data) => {
    checkAuthSocket(data.token, callbackAuth);
    socket.on("disconnect", () => {
      if (socket.auth === true)
        userController.removeUserSocket(socket.decode.id, socket.id);
      log(TAG, `${socket.id} disconnect.`);
    });
  });
};

module.exports = { configSocket };
