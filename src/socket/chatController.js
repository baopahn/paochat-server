const {
  NEW_MESSAGE,
  IS_TYPING,
  READ_ALL_MESS,
  NEW_REACTION,
} = require("./events");

class ChatController {
  constructor() {
    this._io = null;
  }

  setIO(io) {
    this._io = io;
  }

  sendMess(message) {
    const { roomID } = message;
    message.status = "receive";
    this._io.to(roomID).emit(NEW_MESSAGE, message);
  }

  sendReaction(reaction) {
    const { roomID } = reaction;
    this._io.to(roomID).emit(NEW_REACTION, reaction);
  }

  typing(typing) {
    const { roomID } = typing;
    this._io.to(roomID).emit(IS_TYPING, typing);
  }

  readAllMess(readAll) {
    const { roomID } = readAll;
    this._io.to(roomID).emit(READ_ALL_MESS, readAll);
  }
}
const chatController = new ChatController();
module.exports = chatController;
