const axios = require("axios");

const log = async (stack, level, pkg, message) => {
  try {
    await axios.post("http://4.224.186.213/evaluation-service/logs", {
      stack,
      level,
      package: pkg,
      message,
    });
  } catch (err) {
    console.log("Log failed");
  }
};

module.exports = log;