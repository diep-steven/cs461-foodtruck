const pg = require("pg");
const env = require("../../../env.json");

const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect()
    .then(() => {
        console.log(`Connected to database: ${env.database}`);
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err.message);
    });
module.exports = pool;