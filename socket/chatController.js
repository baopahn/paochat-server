const utilTry = require("../utils/utilTry");
const { messageModel, roomModel } = require("../database");
const userController = require("./userController");
const { RECEIVE_MESS, RECEIVE_TYPING } = require("./events");

class ChatController {
  constructor() {
    this._io = null;
  }

  setIO(io) {
    this._io = io;
  }

  async sendMess({ room, sender, receiver, message }) {
    const newMess = new messageModel({ room, sender, receiver, message });
    const roomDB = await utilTry(
      roomModel.findOne({ _id: room }),
      "CHAT_CONTROLLER"
    );

    roomDB.lastMessage = newMess._id;
    await utilTry(
      Promise.all([newMess.save(), roomDB.save()]),
      "CHAT_CONTROLLER"
    );

    const receiverSockets = userController.getSockets(receiver);
    receiverSockets.forEach((socket) =>
      socket.emit(RECEIVE_MESS, {
        room,
        isSender: false,
        message,
        createdAt: newMess.createdAt,
      })
    );

    const senderSockets = userController.getSockets(sender);
    senderSockets.forEach((socket) =>
      socket.emit(RECEIVE_MESS, {
        room,
        isSender: true,
        message,
        createdAt: newMess.createdAt,
      })
    );

    // this._io.to(room).emit(RECEIVE_MESS, { room, sender, receiver, message });
  }

  typing({ room, receiver, status }) {
    const receiverSockets = userController.getSockets(receiver);
    receiverSockets.forEach((socket) =>
      socket.emit(RECEIVE_TYPING, {
        room,
        status,
      })
    );
  }
}
const chatController = new ChatController();

module.exports = chatController;
