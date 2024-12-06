const pool = require("./connection.js");

const getOpeningHoursByTruckId = async (truckId) => {
    try {
        const query = `
            SELECT * FROM OpeningHours
            WHERE truckId = $1
        `;
        const result = await pool.query(query, [truckId]);
        return result.rows;  
    } catch (error) {
        console.error("Error fetching opening hours for truck:", error);
        throw new Error("Error fetching opening hours");
    }
};

module.exports = {
    getOpeningHoursByTruckId
};
