const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const pg = require("pg");
const apiRouter = require("./api/index.js");
const userService = require("./api/services/userService.js")
const trucksService = require("./api/services/trucksService.js")
const menuService = require("./api/services/menuService.js");
const openingHoursService = require("./api/services/openingHoursService.js");
const reviewsService = require("./api/services/reviewsService.js");


const app = express();
const port = 3000;
const hostname = "localhost";

// Middleware to serve static files and parse JSON
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded bodies

app.use(cookieParser());

app.set("view engine", "ejs");

app.use("/api", apiRouter);


// Server setup
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// // Get all food trucks
// app.get("/api/foodtrucks", async (req, res) => {
//   try {
//       const result = await pool.query("SELECT * FROM Foodtruck");
//       res.status(200).json(result.rows); // Send the rows as JSON
//   } catch (err) {
//       console.error("Error fetching food trucks:", err.message);
//       res.status(500).json({ error: "Failed to fetch food trucks" });
//   }
// });

app.use(async (req, res, next) => {
  console.log("User Cookie:", req.cookies.user || "No cookie found");

  const userCookie = req.cookies.user;

  if (userCookie && userCookie.token) {
    try {
      const user = await userService.getUserByToken(userCookie.token);
      console.log("Validated User:", user || "No user found");
      if (user) {
        res.locals.userId = user.userid; // Set userId in res.locals
        res.locals.userName = user.username; // Set userName in res.locals
      } else {
        console.log("Invalid token. Clearing cookie.");
        res.clearCookie("user"); // Clear invalid cookie
        res.locals.userId = null;
        res.locals.userName = null;
      }
    } catch (error) {
      console.error("Error validating token:", error);
      res.locals.userId = null;
      res.locals.userName = null;
    }
  } else {
    console.log("No token found in cookie.");
    res.locals.userId = null;
    res.locals.userName = null;
  }
  next(); // Proceed to the next middleware or route handler
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
app.get("/view-foodtrucks", async (req, res) => {

    try {
      const truckData = await trucksService.getAllTrucks();

        res.render("view-foodtrucks", {
          title: "Foodtruck Table",
          truckData
    });
    } catch (error) {
      console.error("Error getting truck data: ", error)
      res.status(500).send("Error getting foodtrucks");
    }

});


// Route to show the menu for a specific truck
app.get("/truck/:id/menu", async (req, res) => {
  const truckId = parseInt(req.params.id); // Get truckId from the URL

  try {
      // Fetch the truck data (optional) and menu items for this truck
      const truckData = await trucksService.getTruckById(truckId);
      const menuItems = await menuService.getMenuItemsByTruckId(truckId); // Assuming you have a service for menu items

      console.log("menuItems", menuItems);

      // Render the menu page and pass the truck data and menu items
      res.render("menu", {
          title: `Menu for ${truckData.truckname}`,
          truckData,
          menuItems,
      });
  } catch (error) {
      console.error("Error fetching menu data:", error);
      res.status(500).send("Error retrieving menu items.");
  }
});


app.get("/truck/:id/page", async (req, res) => {
  const truckId = parseInt(req.params.id);  // Parse the truck ID from the URL

  try {
    // Fetch the truck data
    const truckData = await trucksService.getTruckById(truckId);

    // Fetch the opening hours for this truck
    const openingHours = await openingHoursService.getOpeningHoursByTruckId(truckId);

    // Log the fetched data for debugging (optional)
    console.log("truckData", truckData);
    console.log("openingHours", openingHours);

    // Render the 'foodTruck' template and pass both truckData and openingHours
    res.render("foodTruck", { 
      title: `Foodtruck`, 
      truckData, 
      openingHours 
    });

  } catch (error) {
    console.error("Error fetching truck or opening hours:", error);
    res.status(500).send("Error fetching truck or opening hours");
  }
});

app.get("/truck/:id/reviews", async (req, res) => {
  const truckId = parseInt(req.params.id);

  // Assuming user ID is stored in session or cookies
  const userId = req.cookies.user ? req.cookies.user.userid : null;


  try {
      const truckData = await trucksService.getTruckById(truckId);
      const reviews = await reviewsService.getReviewsByTruckId(truckId);

      console.log("Validated User:", req.cookies.user); // Debug log
      console.log("User ID:", userId); // Debug log

      res.render("reviews", { truckData, reviews, userId });
  } catch (error) {
      console.error("Error loading reviews:", error);
      res.status(500).send("Error loading reviews.");
  }
});

// Route to add a new review
app.post("/truck/:id/addReview", async (req, res) => {
  const truckId = parseInt(req.params.id);
  const { userId, comment } = req.body;

  console.log("Request Body:", req.body);

  if (!userId) {
      return res.status(400).send("You need to Log in");
  }

  if (!comment) {
      console.error("Missing comment in request body:", req.body);
      return res.status(400).send("Comment is missing.");
  }

  try {
      await reviewsService.addReview(truckId, userId, comment);
      res.redirect(`/truck/${truckId}/reviews`);
  } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).send("Error adding review.");
  }
});
