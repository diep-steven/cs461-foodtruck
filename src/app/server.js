const express = require("express");
const path = require("path");
const pg = require("pg");

const app = express();
const port = 3000;
const hostname = "localhost";

// Load database environment variables
const env = require("../env.json");

// Setup PostgreSQL connection pool
const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect()
    .then(() => {
        console.log(`Connected to database: ${env.database}`);
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err.message);
    });

// Middleware to serve static files and parse JSON
app.use(express.static("public"));
app.use(express.json());

// Routes

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Create Account page
app.get("/create-account", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "create-account.html"));
});

// View Food Trucks page
app.get("/view-foodtrucks", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "view-foodtrucks.html"));
});

// Example route to fetch food trucks from the database
app.get("/api/foodtrucks", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Foodtruck");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching food trucks:", err.message);
        res.status(500).json({ error: "Failed to fetch food trucks" });
    }
});

// Example route for user login
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM Users WHERE username = $1 AND passwordHash = crypt($2, passwordHash)",
            [username, password]
        );
        if (result.rows.length > 0) {
            res.status(200).json({ message: "Login successful", user: result.rows[0] });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ error: "Failed to login" });
    }
});

// Server setup
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// Get all food trucks
app.get("/api/foodtrucks", async (req, res) => {
  try {
      const result = await pool.query("SELECT * FROM Foodtruck");
      res.status(200).json(result.rows); // Send the rows as JSON
  } catch (err) {
      console.error("Error fetching food trucks:", err.message);
      res.status(500).json({ error: "Failed to fetch food trucks" });
  }
});
