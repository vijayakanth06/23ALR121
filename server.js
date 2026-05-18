require("dotenv").config();

const express = require("express");
const cors = require("cors");
const verifyToken = require("./notification_app_be/middleware/auth.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", verifyToken);

const testRoutes = require("./notification_app_be/routes/test.route");
app.use("/api", testRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});