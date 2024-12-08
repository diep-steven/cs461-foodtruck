const { pool }  = require("./connection.js");

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

module.exports = {
    getMenuItemsByTruckId
};
