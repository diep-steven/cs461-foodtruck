const express = require("express");
const apiRouter = express.Router();

const userRouter = require("./controllers/userController.js");
const trucksRouter = require("./controllers/trucksController.js");
const menuRouter = require("./controllers/menuController.js");


apiRouter.use("/users", userRouter);
apiRouter.use("/trucks", trucksRouter);
apiRouter.use("/menu", menuRouter);

module.exports = apiRouter;
