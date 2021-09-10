const { userModel } = require("../../database");
const utilTry = require("../../utils/utilTry");

const getInfo = async (id) => {
  const user = await utilTry(
    userModel.findOne({ _id: id }).select("-_id email fullName avatar"),
    "GET_INFO"
  );
  return user ? { ...user.toObject(), id } : null;
};

const getUserByKeyWord = async (key, myID) => {
  if (!key) return [];

  const keyNormal = key.split("%20").join(" ");
  const regex = new RegExp(`^${keyNormal}.*`, "i");
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

  return listUser.map((user) => {
    const usr = user.toObject();
    const id = usr._id;
    delete usr._id;
    return { ...usr, id };
  });
};

module.exports = { getInfo, getUserByKeyWord };
