const express = require("express");
const userService = require("../services/userService.js");
const crypto = require("crypto");

const makeToken = () => crypto.randomBytes(32).toString("hex");

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

const updateToken = async (userId) => {
    try {
        const newToken = makeToken();
        const result = await userService.updateUser(userId, { usertoken: newToken });
        return result[0];
    } catch (error) {
        throw new Error("Error updating user token");
    }
};

const createUser = async(req, res) => {
    const { username, email, password, cpassword } = req.body;
    console.log("request received");

    if(!username || !email || !password || !cpassword ) {
        res.status(400);
        return res.send("Missing fields required");
    }

    if(password != cpassword) {
        res.status(400);
        return res.send("Passwords do not match");
    }

    try {
        const result = await userService.createUser(username, email, password);
        res.status(200).send();
    } catch (error) {
        if (error.message === "Username or email already exists") {
            res.status(400).send("Username or email already exists");
        } else {
            res.status(500).send("Database error");
        }
    }
}

const loginUser = async(req, res) => {
    const {username, password} = req.body;
    if(!username || !password) {
        return res.status(400).send("Missing credientials");
    }

    const existingToken = req.cookies?.user?.token || req.headers.authorization?.split(' ')[1];
    try {
        const user = await userService.loginUser(username, password);
        if(!user) {
            console.log("Not user");
            return res.status(400).send("Incorrect password");
        }

        if(existingToken && user.usertoken === existingToken) {
            console.log(`Reusing existing token ${existingToken}`);
            res.cookie("user", { token: existingToken, username: user.username }, cookieOptions).send();
            return;
        }

        const updatedUser = await updateToken(user.userid);
        res.cookie("user", { token: updatedUser.usertoken, username: updatedUser.username }, cookieOptions).send();

    } catch (error) {
        return res.status(error.statusCode).send(error.message);
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const details = req.body;

      try {
    const user = await userService.updateUser(id, details);

    if (user.length === 0) {
      return res.status(404).send("Account does not exist");
    }

    if (user.length > 1) {
      return res.status(400).send("More than 1 account found");
    }

    res.status(200).send(user[0]);
  } catch (error) {
    return res.status(500).send(error.status);
  }
}

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);
userRouter.post("update/:id", updateUser);

module.exports = userRouter;