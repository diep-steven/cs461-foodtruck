const express = require("express");
const apiRouter = express.Router();

const userRouter = require("./controllers/userController.js");

apiRouter.use("/users", userRouter);
module.exports = apiRouter;
