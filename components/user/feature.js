const { userModel, roomModel } = require("../../database");
const utilTry = require("../../utils/utilTry");

const getInfo = async (id) => {
  const user = await utilTry(
    userModel.findOne({ _id: id }).select("-_id email fullName avatar"),
    "GET_INFO"
  );

  return user ? user.toObject() : null;
};

const getUserByKeyWord = async (key, myID) => {
  const regex = new RegExp(`^${key}.*`, "i");
  const listUser = await utilTry(
    userModel
      .find({
        $or: [
          { fullName: regex, _id: { $ne: myID } },
          { email: regex, _id: { $ne: myID } },
        ],
      })
      .select("_id email fullName avatar"),
    "GET_USER_BY_KEY"
  );

  return listUser.map((user) => user.toObject());
};

module.exports = { getInfo, getUserByKeyWord };
