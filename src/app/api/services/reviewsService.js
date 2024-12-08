// services/reviewsService.js
const pool = require("./connection.js");

// Get reviews for a specific food truck
const getReviewsByTruckId = async (truckId) => {
    try {
        const query = `
            SELECT r.reviewId, r.comment, u.username
            FROM Reviews r
            JOIN Users u ON r.userId = u.userId
            WHERE r.truckId = $1;
        `;
        const result = await pool.query(query, [truckId]);
        return result.rows;  // Return reviews for the specified truckId
    } catch (error) {
        console.error("Error fetching reviews for truck:", error);
        throw new Error("Error fetching reviews");
    }
};

// Add a new review to the database
const addReview = async (truckId, userId, comment) => {
    try {
        const query = `
            INSERT INTO Reviews (truckId, userId, comment)
            VALUES ($1, $2, $3);
        `;
        console.log("Executing Query:", query, [truckId, userId, comment]);
        await pool.query(query, [truckId, userId, comment]);
    } catch (error) {
        console.error("Error adding review:", error);
        throw new Error("Error adding review");
    }
};


// Delete a review by reviewId
const deleteReview = async (reviewId) => {
    try {
        const query = `
            DELETE FROM Reviews
            WHERE reviewId = $1;
        `;
        await pool.query(query, [reviewId]);
    } catch (error) {
        console.error("Error deleting review:", error);
        throw new Error("Error deleting review");
    }
};

module.exports = {
    getReviewsByTruckId,
    addReview,
    deleteReview,
};
