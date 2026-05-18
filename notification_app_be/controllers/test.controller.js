const log = require("../../logging_middleware/logger");

const testController = async (req, res) => {
  try {
    await log("backend", "info", "controller", "Test API hit");

    res.status(200).json({
      message: "API working",
    });
  } catch (error) {
    await log("backend", "error", "controller", error.message);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

module.exports = { testController };