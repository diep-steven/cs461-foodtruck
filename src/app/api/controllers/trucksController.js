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

const getTruckMenuById = async (req, res) => {
    const truckId = parseInt(req.params.id);

    if (!truckId) {
        return res.status(400).send("Invalid truck ID");
    }

    try {
        const truck = await trucksService.getTruckById(truckId);
        const menuItems = await menuService.getMenuByTruckId(truckId);  // Assuming menuService exists

        if (!truck) {
            return res.status(404).send("Food truck not found");
        }

        res.render('menu', {
            truckData: truck,
            menuItems: menuItems
        });
    } catch (error) {
        return res.status(500).send("Error retrieving menu");
    }
};

const trucksRouter = express.Router();

trucksRouter.get("/getAll", getAllTrucks);
trucksRouter.get("/getTruck/:id", getFoodTruckById);
trucksRouter.get("/truck/:id/menu", getTruckMenuById);

module.exports = trucksRouter;