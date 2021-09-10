const { roomModel, conversationModel } = require("../database");
const utilTry = require("../utils/utilTry");
const { log } = require("./utils");

class UserController {
  constructor() {
    this._io = null;
    this._listUser = [];
  }

  setIO(io) {
    this._io = io;
  }

  async addUserSocket(socket) {
    const userID = socket.decode.id;
    const socketID = socket.id;

    const oldUser = this._listUser.find((user) => user.userID === userID);

    if (oldUser) oldUser.socket.push(socketID);
    else this._listUser.push({ userID, socket: [socketID] });

    const allRoom = await utilTry(
      conversationModel.find({ listUsers: { $in: [userID] } }).select("_id"),
      "ADD_USER_SOCKET"
    );

    if (allRoom.length === 0) return;

    const sockets = this.getSockets(userID);
    sockets.forEach((socket) =>
      allRoom.forEach(({ _id }) => socket.join(`${_id}`))
    );
  }

  removeUserSocket(socket) {
    const userID = socket.decode.id;
    const socketID = socket.id;

    const indexUser = this._listUser.findIndex((usr) => usr.userID === userID);
    const oldUser = this._listUser[indexUser];
    if (!oldUser) return;

    oldUser.socket = oldUser.socket.filter((sID) => sID !== socketID);
    if (oldUser.socket.length === 0) this._listUser.splice(indexUser, 1);
  }

  getUserByID(userID) {
    return this._listUser.find((user) => user.userID === userID) || null;
  }

  getSockets(userID) {
    const user = this.getUserByID(userID);
    if (!user) return [];

    return user.socket
      .map((socketID) => this._io.of("/").sockets.get(socketID) || null)
      .filter((s) => s !== null);
  }

  joinRoom(userID, roomID) {
    const sockets = this.getSockets(userID);
    console.log(sockets.length);
    sockets.forEach((socket) => {
      socket.join(roomID);
    });
  }
}

const userController = new UserController();

module.exports = userController;
