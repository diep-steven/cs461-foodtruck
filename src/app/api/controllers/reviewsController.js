// controllers/reviewsController.js
const express = require("express");
const reviewsService = require("../services/reviewsService");

// Get reviews for a specific truck
const getReviews = async (req, res) => {
    try {
        const { truckId } = req.params;
        const userId = req.cookies.user ? req.cookies.user.userid : null; // Current user ID
        const reviews = await reviewsService.getReviewsByTruckId(truckId);
        const truckData = await trucksService.getTruckById(truckId);
        res.render("reviews", { reviews, truckId }); // Pass reviews data to the EJS view
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Add a new review
const addReview = async (req, res) => {
    try {
        const { truckId, userId, comment } = req.body;  // Get review data from the request body
        await reviewsService.addReview(truckId, userId, comment);
        res.redirect(`/truck/${truckId}/reviews`); // Redirect back to the reviews page after adding
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).send("Internal Server Error");
    }
};


const reviewsRouter = express.Router();

// Define routes for viewing and adding reviews
reviewsRouter.get("/getReviews/:truckId", getReviews);
reviewsRouter.post("/addReview", addReview);

module.exports = reviewsRouter;
