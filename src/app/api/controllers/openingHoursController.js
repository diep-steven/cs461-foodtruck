const express = require("express");
const openingHoursService = require('../services/openingHoursService');

// Controller function to fetch opening hours by truckId
const getOpeningHours = async (req, res) => {
    try {
        const truckId = req.params.truckId;

        // Validate truckId
        if (!truckId) {
            return res.status(400).send("Truck ID is required.");
        }

        // Fetch opening hours using the service
        const openingHours = await openingHoursService.getOpeningHoursByTruckId(truckId);

        // Pass data to the openingHours.ejs view
        res.render('openingHours', {
            truckData: { truckId },  // Include truckId or any other truck-related data if needed
            openingHours,
        });
    } catch (error) {
        console.error("Error fetching opening hours: ", error);
        res.status(500).send("Internal Server Error");
    }
}
const openingHoursRouter = express.Router();

openingHoursRouter.get("/getOpeningHours/:truckID", getOpeningHours);

module.exports = openingHoursRouter;
