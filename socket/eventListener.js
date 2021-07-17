const { SEND_MESS, SEND_TYPING, SEND_READ_ALL_MESS } = require("./events");
const chatController = require("./chatController");

const configEventListener = (socket) => {
  socket.on(SEND_MESS, (props) =>
    chatController.sendMess({ ...props, sender: socket.decode.id })
  );

  socket.on(SEND_TYPING, (props) => {
    chatController.typing(props);
  });

  socket.on(SEND_READ_ALL_MESS, (props) => {
    chatController.readAllMess(props);
  });
};

module.exports = { configEventListener };
