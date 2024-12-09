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

async function addMenuItem(truckId, newData) {
    // Parse spicylevel and ensure it's a number (default to 0 if empty)
    // Check if spicylevel is passed, otherwise default it to 0
    let spicyLevel;
    if (newData.spicylevel) {
        // Parse spicylevel to an integer, ensuring it's a number
        spicyLevel = parseInt(newData.spicylevel, 10);
        if (isNaN(spicyLevel)) {
            // If it's not a valid number, set to a default value (e.g., 0)
            spicyLevel = 0;
        }
    } else {
        // Default value if spicylevel is undefined
        spicyLevel = 0;
    }

    console.log("Spicy Level after parsing:", spicyLevel); // Debugging line to check spicyLevel



    // Ensure that booleans for halal, vegetarian, and vegan are correctly parsed
    const halal = newData.halal === 'true';
    const vegetarian = newData.vegetarian === 'true';
    const vegan = newData.vegan === 'true';

    // Insert query for MenuItem
    const insertMenuItemQuery = `
        INSERT INTO MenuItem (truckId, itemPrice, foodName, dietaryRestrictionId)
        VALUES ($1, $2, $3, $4)
        RETURNING itemId;
    `;

    // Insert query for DietaryRestrictions
    const insertDietaryRestrictionsQuery = `
        INSERT INTO DietaryRestrictions (allergySource, spicyLevel, halal, vegetarian, vegan)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING restrictionId;
    `;

    // Values for MenuItem insertion
    const menuItemValues = [
        truckId,
        parseFloat(newData.itemprice), // Ensure item price is a number
        newData.foodname,
        null // dietaryRestrictionId will be populated after inserting dietary restrictions
    ];

    // Values for DietaryRestrictions insertion
    const dietaryRestrictionValues = [
        newData.allergysource || null, // Null if no allergy source provided
        spicyLevel, // Use updated spicyLevel
        halal, // Ensure boolean value for halal
        vegetarian, // Ensure boolean value for vegetarian
        vegan, // Ensure boolean value for vegan
    ];

    const client = await pool.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        // Insert new dietary restriction
        const dietaryRestrictionsResult = await client.query(insertDietaryRestrictionsQuery, dietaryRestrictionValues);
        const restrictionId = dietaryRestrictionsResult.rows[0].restrictionId;

        // Insert new menu item and associate it with the dietary restriction
        menuItemValues[3] = restrictionId; // Set the dietaryRestrictionId in menu item values

        const menuItemResult = await client.query(insertMenuItemQuery, menuItemValues);
        const newItemId = menuItemResult.rows[0].itemId;

        // Commit transaction
        await client.query('COMMIT');

        // Return the newly added menu item
        return {
            itemId: newItemId,
            truckId,
            foodName: newData.foodname,
            itemPrice: newData.itemprice,
            dietaryRestrictionId: restrictionId,
        };
    } catch (error) {
        // Rollback in case of error
        await client.query('ROLLBACK');
        console.error("Error adding new menu item:", error);
        throw error;
    } finally {
        client.release();
    }
}




module.exports = {
    addMenuItem,
    getMenuItemsByTruckId,
    getMenuItemById,
};