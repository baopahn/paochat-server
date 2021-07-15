const { MAX_MESSAGE } = require("../../config");
const { messageModel, roomModel, userModel } = require("../../database");
const utilTry = require("../../utils/utilTry");

const getHistoryChat = async (id) => {
  const historyChatRaw = await utilTry(
    await roomModel
      .find({
        $or: [
          { firstUser: id, lastMessage: { $ne: null } },
          { secondUser: id, lastMessage: { $ne: null } },
        ],
      })
      .sort({ updatedAt: "desc" })
      .populate("firstUser", "fullName avatar")
      .populate("secondUser", "fullName avatar")
      .populate("lastMessage", "-_id message")
      .select("-__v -createdAt"),
    "GET_LIST_MESSAGE"
  );

  const historyChat = historyChatRaw.map((chatRaw) => {
    const chat = chatRaw.toObject();
    const friend = chat.firstUser._id == id ? chat.secondUser : chat.firstUser;
    const { lastMessage } = chat;
    chat.fullName = friend.fullName;
    chat.avatar = friend.avatar;
    chat.lastMessage = lastMessage ? lastMessage.message : "...";

    delete chat.firstUser;
    delete chat.secondUser;
    return chat;
  });

  return historyChat;
};

const getHistoryMessage = async (id, myID, page) => {
  const [room, listMessageRaw] = await utilTry(
    Promise.all([
      roomModel
        .findOne({ _id: id })
        .populate("firstUser", "fullName avatar")
        .populate("secondUser", "fullName avatar"),
      messageModel
        .find({ room: id })
        .sort({ createdAt: "desc" })
        .select("-__v -_id -room")
        .skip((page - 1) * MAX_MESSAGE)
        .limit(MAX_MESSAGE),
    ]),
    "GET_CHAT"
  );

  const friend = room.firstUser._id == myID ? room.secondUser : room.firstUser;

  if (!listMessageRaw || listMessageRaw.length === 0)
    return { listMess: [], friend };

  const listMessageShort = [];
  let length = 0;
  for (messRaw of listMessageRaw) {
    const mess = messRaw.toObject();
    const isSender = mess.sender._id == myID;
    mess.isSender = isSender;
    delete mess.sender;
    delete mess.receiver;

    if (length > 0 && mess.isSender === listMessageShort[length - 1].isSender) {
      listMessageShort[length - 1].message.push(mess.message);
    } else {
      listMessageShort.push({ ...mess, message: [mess.message] });
      length++;
    }
  }

  return { listMess: listMessageShort, friend };
};

const getChatRoom = async (myID, friendID) => {
  let [room, friend] = await utilTry(
    Promise.all([
      roomModel
        .findOne({
          $or: [
            { firstUser: myID, secondUser: friendID },
            { firstUser: friendID, secondUser: myID },
          ],
        })
        .populate("lastMessage", "-_id message")
        .select("_id updatedAt"),
      userModel.findOne({ _id: friendID }).select("_id avatar email fullName"),
    ]),
    "GET_CHAT_ROOM"
  );

  if (!room) {
    room = new roomModel({ firstUser: myID, secondUser: friendID });
    await utilTry(room.save(), "GET_CHAT_ROOM");
  }

  const { lastMessage } = room;
  const roomChat = {
    _id: room._id,
    friendID: friend._id,
    avatar: friend.avatar,
    email: friend.email,
    fullName: friend.fullName,
    updatedAt: room.updatedAt,
    lastMessage: lastMessage ? lastMessage.message : "",
  };

  return roomChat;
};

module.exports = { getHistoryMessage, getHistoryChat, getChatRoom };
