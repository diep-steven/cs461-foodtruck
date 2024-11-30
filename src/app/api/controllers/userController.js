const express = require("express");
const userService = require("../services/userService.js");
const crypto = require("crypto");

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
        await userService.createUser(username, email, password);
    } catch (error) {
        if (error.message === "Username or email already exists") {
            res.status(400).send("Username or email already exists");
        } else {
            res.status(500).send("Database error");
        }
    }
}

const userRouter = express.Router();

userRouter.post("/create", createUser);

module.exports = userRouter;