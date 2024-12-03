const express = require("express");
const apiRouter = express.Router();

const userRouter = require("./controllers/userController.js");
const trucksRouter = require("./controllers/trucksController.js");

apiRouter.use("/users", userRouter);
apiRouter.use("/trucks", trucksRouter);

module.exports = apiRouter;
