const utilTry = async (execute, tag) => {
  try {
    return await execute;
  } catch (e) {
    console.log(`[${tag}_FAIL]: ${e.message}`);
    return null;
  }
};

module.exports = utilTry;
