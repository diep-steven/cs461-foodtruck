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

const createDietaryRestriction = async (restrictionData) => {
    if (!restrictionData) {
        throw new Error("Missing restriction data");
    }

    const { 
        allergySource = null, 
        spicyLevel = 0, 
        halal = false, 
        vegetarian = false, 
        vegan = false 
    } = restrictionData; // Provide default values

    try {
        const query = `
            INSERT INTO DietaryRestrictions (allergySource, spicyLevel, halal, vegetarian, vegan)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING restrictionId;
        `;
        const values = [allergySource, spicyLevel, halal, vegetarian, vegan];
        const result = await pool.query(query, values);
        return result.rows[0].restrictionid;
    } catch (error) {
        console.error("Error creating dietary restriction:", error);
        throw new Error("Error creating dietary restriction");
    }
};


const addMenuItem = async (menuItem) => {
    const query = `
        INSERT INTO MenuItem (truckId, itemPrice, foodName, dietaryRestrictionId)
        VALUES ($1, $2, $3, $4);
    `;
    const values = [
        menuItem.truckId,
        menuItem.itemPrice,
        menuItem.foodName,
        menuItem.dietaryRestrictionId,
    ];

    try {
        await pool.query(query, values);
    } catch (error) {
        console.error("Error adding menu item:", error);
        throw new Error("Error adding menu item.");
    }
};

module.exports = {
    createDietaryRestriction,
    addMenuItem,
    getMenuItemsByTruckId,
};
