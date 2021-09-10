const { conversationModel, userModel } = require("../../database");
const userController = require("../../socket/userController");
const utilTry = require("../../utils/utilTry");

const getConversation = async (myID, friendID) => {
  let [conversation, myAccount, friendAccount] = await utilTry(
    Promise.all([
      conversationModel
        .findOne({
          $and: [
            { listUsers: { $in: [myID] } },
            { listUsers: { $in: [friendID] } },
          ],
        })
        .populate("listUsers", "_id fullName email avatar")
        .select("_id listUsers"),
      userModel.findOne({ _id: myID }).select("_id fullName email avatar"),
      userModel.findOne({ _id: friendID }).select("_id fullName email avatar"),
    ]),
    "GET_CONVERSATION"
  );

  if (!conversation && friendAccount && myAccount) {
    conversation = new conversationModel({ listUsers: [myID, friendID] });
    userController.joinRoom(myID, conversation._id.toString());
    userController.joinRoom(friendID, conversation._id.toString());
    await utilTry(conversation.save(), "GET_CONVERSATION");
    conversation.listUsers = [myAccount, friendAccount];
  }

  const conversationO = conversation.toObject();
  conversationO.roomID = conversationO._id;
  conversationO.user = friendAccount.toObject();
  conversationO.user.id = conversationO.user._id;
  conversationO.myUid = myID;
  conversationO.lastMessage = null;

  delete conversationO._id;
  delete conversationO.user._id;
  delete conversationO.listUsers;

  return conversationO;
};

module.exports = { getConversation };
