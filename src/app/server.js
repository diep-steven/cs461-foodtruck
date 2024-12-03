const express = require("express");
const path = require("path");
const pg = require("pg");
const apiRouter = require("./api/index.js");

const app = express();
const port = 3000;
const hostname = "localhost";

// Middleware to serve static files and parse JSON
app.use(express.static("public"));
app.use(express.json());

app.set("view engine", "ejs");

app.use("/api", apiRouter);


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

// Routes

// Home page
app.get("/", (req, res) => {
    res.render("index", {
        title: "CS461 Foodtrucks",
    });
});

// Login page
app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
    });
});

// Create Account page
app.get("/create-account", (req, res) => {
    res.render("create-account", {
        title: "Create account",
    });
});

// View Food Trucks page
app.get("/view-foodtrucks", (req, res) => {
    res.render("view-foodtrucks", {
        title: "Foodtruck Table",
    });
});

// // Example route to fetch food trucks from the database
// app.get("/api/foodtrucks", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM Foodtruck");
//         res.status(200).json(result.rows);
//     } catch (err) {
//         console.error("Error fetching food trucks:", err.message);
//         res.status(500).json({ error: "Failed to fetch food trucks" });
//     }
// });