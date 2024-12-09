const { pool } = require("./connection.js");

const getMenuItemsByTruckId = async (truckId) => {
    try {
        const query = `
            SELECT * FROM MenuItem mi
            JOIN DietaryRestrictions dr ON mi.dietaryRestrictionId = dr.restrictionId
            WHERE truckId = $1
        `;
        const result = await pool.query(query, [truckId]);
        return result.rows;
    } catch (error) {
        console.error("Error fetching menu for truck:", error);
        throw new Error("Error fetching menu");
    }
};

async function getMenuItemById(itemId) {
    try {
        const query = 'SELECT * FROM MenuItem WHERE itemId = $1';
        const result = await pool.query(query, [itemId]);

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching menu item by ID:', error);
        throw error;
    }
}

async function updateMenuItem(itemId, truckId, updatedData) {
    // Default spicyLevel to 0 if it's an empty string
    const spicyLevel = updatedData.spicylevel === "" ? 0 : parseInt(updatedData.spicylevel);

    const updateMenuItemQuery = `
        UPDATE MenuItem
        SET foodName = $1, itemPrice = $2
        WHERE itemId = $3 AND truckId = $4;
    `;

    const updateDietaryRestrictionsQuery = `
        UPDATE DietaryRestrictions
        SET allergySource = $1, spicyLevel = $2, halal = $3, vegetarian = $4, vegan = $5
        WHERE restrictionId = (SELECT dietaryRestrictionId FROM MenuItem WHERE itemId = $6);
    `;

    // Make sure all values are passed correctly
    const menuItemValues = [
        updatedData.foodname,
        updatedData.itemprice,
        itemId,
        truckId,
    ];

    const dietaryRestrictionValues = [
        updatedData.allergysource || null, // Null if no allergy source provided
        spicyLevel, // Use updated spicyLevel
        updatedData.halal ? true : false, // Ensure boolean value for halal
        updatedData.vegetarian ? true : false, // Ensure boolean value for vegetarian
        updatedData.vegan ? true : false, // Ensure boolean value for vegan
        itemId, // Use itemId to find the correct dietary restriction
    ];

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await client.query(updateMenuItemQuery, menuItemValues);
        await client.query(updateDietaryRestrictionsQuery, dietaryRestrictionValues);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error updating menu item:", error);
        throw error;
    } finally {
        client.release();
    }
}

async function getMenuItemWithDietaryRestrictions(itemId) {
    const query = `
        SELECT mi.foodName, mi.itemPrice, dr.allergySource, dr.spicyLevel, dr.halal, dr.vegetarian, dr.vegan
        FROM MenuItem mi
        JOIN DietaryRestrictions dr ON mi.dietaryRestrictionId = dr.dietaryRestrictionId
        WHERE mi.itemId = $1;
    `;

    const result = await pool.query(query, [itemId]);
    return result.rows[0];
}

module.exports = {
    getMenuItemsByTruckId,
    getMenuItemById,
    updateMenuItem,
    getMenuItemWithDietaryRestrictions
};
