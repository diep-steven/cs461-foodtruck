const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const pg = require("pg");
const apiRouter = require("./api/index.js");
const userService = require("./api/services/userService.js")
const trucksService = require("./api/services/trucksService.js")
const menuService = require("./api/services/menuService.js");
const openingHoursService = require("./api/services/openingHoursService.js");


const app = express();
const port = 3000;
const hostname = "localhost";

// Middleware to serve static files and parse JSON
app.use(express.static("public"));
app.use(express.json());
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
  const userCookie = req.cookies.user;

  if (userCookie && userCookie.token) {
    try {
      const user = await userService.getUserByToken(userCookie.token);
      if (user) {
        res.locals.userName = user.username;
        next();
      } else {
        res.locals.userName = null;
        res.clearCookie('user');
        res.status(401).redirect('/');
      }
    } catch (error) {
      console.error("Error validating token:", error);
      res.locals.userName = null;
      res.status(500).send("Error validating user token.");
    }
  } else {
    res.locals.userName = null;
    next();
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

app.get("/truck/:id/page", async (req, res) => {
  console.log("test123");
  const truckId = parseInt(req.params.id);

  try {
    const truckData = await trucksService.getTruckById(truckId);
    console.log("truckData", truckData);

    res.render("foodTruck", {
      title: `Foodtruck`,
      truckData
    });

  } catch (error) {
      console.error("Error fetching truck:", error);
      res.status(500).send("Error retrieving the truck.");
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


app.get("/truck/:id/openingHours", async (req, res) => {
  const truckId = parseInt(req.params.id);
  try {
      const truckData = await trucksService.getTruckById(truckId);
      const openingHours = await openingHoursService.getOpeningHoursByTruckId(truckId);

      console.log("openingHours", openingHours);

      res.render('openingHours', { truckData, truckId, openingHours });
  } catch (error) {
      console.error("Error fetching opening hours: ", error);
      res.status(500).send("Error fetching opening hours");
  }
});