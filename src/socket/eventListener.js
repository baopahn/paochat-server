const {
  NEW_MESSAGE,
  IS_TYPING,
  READ_ALL_MESS,
  NEW_REACTION,
} = require("./events");
const chatController = require("./chatController");

const configEventListener = (socket) => {
  socket.on(NEW_MESSAGE, (message) => chatController.sendMess(message));
  socket.on(NEW_REACTION, (reaction) => chatController.sendReaction(reaction));
  socket.on(IS_TYPING, (typing) => chatController.typing(typing));
  socket.on(READ_ALL_MESS, (readAll) => chatController.readAllMess(readAll));
};

module.exports = { configEventListener };
