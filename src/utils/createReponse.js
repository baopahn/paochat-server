const createResponse = (status, message, data) => {
  return {
    status,
    message,
    data,
  };
};

module.exports = createResponse;
