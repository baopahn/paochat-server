const createResponse = (status, message, data) => ({
  status,
  message,
  data,
});

module.exports = createResponse;
