const { roomModel } = require("../database");
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

  async addUserSocket(userID, socketID) {
    const oldUser = this._listUser.find((user) => user.userID === userID);

    if (oldUser) oldUser.socket.push(socketID);
    else this._listUser.push({ userID, socket: [socketID] });

    // const allRoom = await utilTry(
    //   roomModel
    //     .find({ $or: [{ firstUser: userID }, { secondUser: userID }] })
    //     .select("_id"),
    //   "ADD_USER_SOCKET"
    // );

    // if (!allRoom) return;
    // const sockets = this.getSockets(userID);
    // sockets.forEach((socket) =>
    //   allRoom.forEach(({ _id }) => socket.join(`${_id}`))
    // );
  }

  removeUserSocket(userID, socketID) {
    const indexUser = this._listUser.findIndex((usr) => usr.userID === userID);
    const oldUser = this._listUser[indexUser];
    if (!oldUser) return;

    let { socket } = oldUser;
    socket = socket.filter((sID) => sID !== socketID);
    if (socket.length === 0) this._listUser.splice(indexUser, 1);
  }

  getUserByID(userID) {
    return this._listUser.find((user) => user.userID === userID) || null;
  }

  getSockets(userID) {
    const user = this.getUserByID(userID);
    if (!user) return [];

    return user.socket.map(
      (socketID) => this._io.of("/").sockets.get(socketID) || null
    );
  }
}

const userController = new UserController();

module.exports = userController;
