const express = require("express");
const apiRouter = express.Router();

const userRouter = require("./controllers/userController.js");
const trucksRouter = require("./controllers/trucksController.js");
const menuRouter = require("./controllers/menuController.js");
const openingHoursRouter = require("./controllers/openingHoursController.js");
const reviewsRouter = require("./controllers/reviewsController.js");


apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/trucks", trucksRouter);
apiRouter.use("/menu", menuRouter);
apiRouter.use("/openingHours", openingHoursRouter);

module.exports = apiRouter;
