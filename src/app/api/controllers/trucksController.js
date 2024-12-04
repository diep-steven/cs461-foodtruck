const express = require("express");
const trucksService = require("../services/trucksService.js");

const getAllTrucks = async (req, res) => {
    try {
        const trucks = await trucksService.getAllTrucks();
        return res.json(trucks);
    } catch (error) {
        res.status(500).send("Error when retrieving trucks list");
    }
}


const trucksRouter = express.Router();

trucksRouter.get("/getAll", getAllTrucks);
module.exports = trucksRouter;