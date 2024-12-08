const { pool, clientTest } = require("./connection.js");


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
    if(!id) {
        throw new Error("No id provided");
    }

    try {
        const query = `
            SELECT * FROM Foodtruck
            WHERE truckid = $1`
        ;
        
        const values = [id];
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

const addTruck = async (payload) => {
    console.log(payload);

    try {
        if(!payload.truckname) {
            throw new Error("No truck name provided");
        }

        const truckQuery = `
            INSERT INTO Foodtruck(truckname, address, phoneNumber, description, externalLink)
            VALUES($1, $2, $3, $4, $5)
            RETURNING truckId`;
        const truckVals = [payload.truckname, payload.address, payload.phoneNumber, payload.description, payload.externalLink];
        console.log(truckVals);
        await clientTest.client.query("BEGIN");
        const result = await clientTest.client.query(truckQuery, truckVals);
        const resultTruckId = result.rows[0].truckid;

        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const daysOfWeekAbr = ["mon", "tues", "wed", "thur", "fri", "sat", "sun"];

        const hoursQuery = `
            INSERT INTO OpeningHours(truckId, dayOfWeek, startTime, endTime, isClosed)
            VALUES  ($1, $2, $3, $4, $5),
                    ($6, $7, $8, $9, $10),
                    ($11, $12, $13, $14, $15),
                    ($16, $17, $18, $19, $20),
                    ($21, $22, $23, $24, $25),
                    ($26, $27, $28, $29, $30),
                    ($31, $32, $33, $34, $35)
            `;
        const hourVals = [];
        for (let i = 0 ; i < daysOfWeek.length; i++) {
            dayWhole = daysOfWeek[i];
            dayAbbr = daysOfWeekAbr[i];
            hourOpen = payload[dayAbbr + "Open"];
            hourClose = payload[dayAbbr + "Close"]
            isClosed = payload[dayAbbr + "Closed"]

            hourVals.push(resultTruckId, dayWhole, hourOpen, hourClose, isClosed);
        }
        const hourRes = await clientTest.client.query(hoursQuery, hourVals);
        await clientTest.client.query("COMMIT");

    } catch (error) {
        console.error("ERROR " , error);
            if (error.code === "23505") {
            clientTest.client.query(`ROLLBACK`);
            throw new Error("Something already exists");
        }
        clientTest.client.query(`ROLLBACK`);
        throw new Error("Error adding truck");

    }


    
}


module.exports = {
    getAllTrucks,
    getTruckById,
    addTruck,
}