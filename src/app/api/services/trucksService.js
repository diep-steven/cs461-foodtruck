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

const getTruckById = async (id) => {
    console.log("id is: ", id);
    if(!id) {
        throw new Error("No id provided");
    }

    try {
        const query = `
            SELECT * FROM Foodtruck
            WHERE truckid = $1`
        ;
        
        const values = [id];
        console.log("values: ", values);
        const result = await pool.query(query, values);
        if(result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw new Error ("Problem retrieving foodtrucks");
    }
};


module.exports = {
    getAllTrucks,
    getTruckById
}