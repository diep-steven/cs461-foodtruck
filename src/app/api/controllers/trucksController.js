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

const getFoodTruckById = async (req, res) => {
    const { id } = parseInt(req.params);

    if(!id) {
        console.error("No id given");
        return res.status(400).send("No id found");
    }

    try {

        const truck = await trucksService.getTruckById(id);
        res.status(200).send(truck);
    } catch (error) {
        return res.status(500).send(error.status);
  }
}


const trucksRouter = express.Router();

trucksRouter.get("/getAll", getAllTrucks);
trucksRouter.get("/getTruck/:id", getFoodTruckById);

module.exports = trucksRouter;