const { SEND_MESS, SEND_TYPING } = require("./events");
const chatController = require("./chatController");

const configEventListener = (socket) => {
  socket.on(SEND_MESS, (props) =>
    chatController.sendMess({ ...props, sender: socket.decode.id })
  );

  socket.on(SEND_TYPING, (props) => {
    chatController.typing(props);
  });
};

module.exports = { configEventListener };
