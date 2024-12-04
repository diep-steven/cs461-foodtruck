const pool = require("./connection.js");

const getAllTrucks = async () => {
    try {
        const query = `
            SELECT * FROM Foodtruck
            `;

        const result = await pool.query(query);
        return result.rows;
    } catch(error) {
        console.error("Error when retrieving trucks");
        throw new Error("Error when retrieving trucks");
    }
}



module.exports = {
    getAllTrucks,
}