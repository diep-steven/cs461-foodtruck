import express from "express";
import pg from "pg";

const app = express();
const port = 3000;
const hostname = "localhost";

const Pool = pg.Pool;

const env = require("../env.json");

app.use(express.static("public"));


app.listen(port, hostname, () => {
  console.log(`Listening at: http://${hostname}:${port}`);
});