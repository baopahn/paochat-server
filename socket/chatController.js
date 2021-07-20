const utilTry = require("../utils/utilTry");
const { messageModel, roomModel } = require("../database");
const userController = require("./userController");
const {
  RECEIVE_MESS,
  RECEIVE_TYPING,
  RECEIVE_READ_ALL_MESS,
} = require("./events");

class ChatController {
  constructor() {
    this._io = null;
  }

  setIO(io) {
    this._io = io;
  }

  async sendMess({ room, sender, receiver, message, idLocal }) {
    const newMess = new messageModel({
      ...message,
      room,
      sender,
      receiver,
      read: false,
    });
    const roomDB = await utilTry(
      roomModel.findOne({ _id: room }),
      "CHAT_CONTROLLER"
    );

    roomDB.lastMessage = newMess._id;
    roomDB.updatedAt = newMess.createdAt;
    await utilTry(
      Promise.all([newMess.save(), roomDB.save()]),
      "CHAT_CONTROLLER"
    );

    try {
      const receiverSockets = userController.getSockets(receiver);
      receiverSockets.forEach((socket) => {
        if (socket)
          socket.emit(RECEIVE_MESS, {
            room,
            isSender: false,
            message,
            createdAt: newMess.createdAt,
            idLocal,
          });
      });

      const senderSockets = userController.getSockets(sender);
      senderSockets.forEach((socket) => {
        if (socket)
          socket.emit(RECEIVE_MESS, {
            room,
            isSender: true,
            message,
            createdAt: newMess.createdAt,
            idLocal,
          });
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  typing({ room, receiver, status }) {
    const receiverSockets = userController.getSockets(receiver);
    receiverSockets.forEach((socket) => {
      if (socket)
        socket.emit(RECEIVE_TYPING, {
          room,
          status,
        });
    });
  }

  async readAllMess({ room, receiver }) {
    const receiverSockets = userController.getSockets(receiver);
    receiverSockets.forEach((socket) =>
      socket.emit(RECEIVE_READ_ALL_MESS, { room })
    );

    await utilTry(
      messageModel.updateMany({ room, sender: receiver }, { read: true }),
      "READ_ALL_MESS"
    );
  }
}
const chatController = new ChatController();

module.exports = chatController;
