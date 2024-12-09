const pool = require("./connection.js");

const getMenuItemsByTruckId = async (truckId) => {
    try {
        const query = `
            SELECT * FROM MenuItem mi
            JOIN DietaryRestrictions dr ON mi.dietaryRestrictionId = dr.restrictionId
            WHERE truckId = $1
        `;
        const result = await pool.query(query, [truckId]);
        return result.rows;  // Return the menu items along with dietary restrictions
    } catch (error) {
        console.error("Error fetching menu for truck:", error);
        throw new Error("Error fetching menu");
    }
};

const addMenuItem = async (truckId, foodName, itemPrice, dietaryRestrictionId) => {
    try {
        const query = `
            INSERT INTO MenuItem (truckId, foodName, itemPrice, restrictionId)
            VALUES ($1, $2, $3, $4)
        `;
        const values = [truckId, foodName, itemPrice, dietaryRestrictionId];
        await pool.query(query, values);
    } catch (error) {
        console.error("Error inserting menu item:", error);
        throw new Error("Error adding menu item");
    }
};

const getAllDietaryRestrictions = async () => {
    try {
        const query = "SELECT * FROM DietaryRestrictions";
        const result = await pool.query(query);
        console.log("Dietary Restrictions Data:", result.rows); // Log the result for debugging
        return result.rows;
    } catch (error) {
        console.error("Error fetching dietary restrictions:", error);
        throw new Error("Error fetching dietary restrictions");
    }
};


module.exports = {
    addMenuItem,
    getMenuItemsByTruckId,
    getAllDietaryRestrictions,
};