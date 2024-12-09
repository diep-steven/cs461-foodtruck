const express = require("express");
const menuService = require('../services/menuService');

const getMenuItems = async (req, res) => {
    try {
        const truckId = req.query.truckId; // Example: Pass truckId as a query param
        const menuItems = await menuService.getMenuItems(truckId);
        const dietaryRestrictions = await menuService.getAllDietaryRestrictions();

        console.log('Dietary Restrictions:', dietaryRestrictions);

        
        res.render('menu', { 
            menuItems, 
            dietaryRestrictions  // Pass dietaryRestrictions to the view
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).send('Internal Server Error');
    }
};


const menuRouter = express.Router();

menuRouter.get("/getMenu/:truckID", getMenuItems);

module.exports = menuRouter;