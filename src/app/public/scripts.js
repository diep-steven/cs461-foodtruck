async function submitTruckForm(event) {
    event.preventDefault();

    const truckData = {
        truckname: document.getElementById("truckname").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        address: document.getElementById("address").value,
        description: document.getElementById("description").value,
        externalLink: document.getElementById("externalLink").value,
    };

    try {
        const response = await fetch("/add-truck", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(truckData),
        });

        if (response.ok) {
            alert("Truck added successfully!");
        } else {
            alert("Error adding truck.");
        }
    } catch (err) {
        console.error(err);
        alert("Server error.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelector(".nav-links");

    // Example: Simulate user login state
    const userLoggedIn = false; // Change to true if logged in

    if (userLoggedIn) {
        navLinks.innerHTML = `
            <li><a href="/view-foodtrucks">View Food Trucks</a></li>
            <li><a href="/logout">Logout</a></li>
        `;
    } else {
        navLinks.innerHTML = `
            <li><a href="/view-foodtrucks">View Food Trucks</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/create-account">Create Account</a></li>
        `;
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const foodTruckList = document.getElementById("foodtruck-list");

    try {
        const response = await fetch("/api/foodtrucks");
        if (response.ok) {
            const foodTrucks = await response.json();
            foodTrucks.forEach(truck => {
                const truckElement = document.createElement("div");
                truckElement.className = "foodtruck-item";
                truckElement.innerHTML = `
                    <h3>${truck.truckname}</h3>
                    <p>${truck.description || "No description available."}</p>
                    <p>Address: ${truck.address || "Not provided."}</p>
                    <a href="${truck.externalLink}" target="_blank">More Info</a>
                `;
                foodTruckList.appendChild(truckElement);
            });
        } else {
            foodTruckList.innerHTML = "<p>Failed to load food trucks.</p>";
        }
    } catch (error) {
        console.error("Error fetching food trucks:", error);
        foodTruckList.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    }
});
document.addEventListener("DOMContentLoaded", async () => {
    const foodTruckList = document.getElementById("foodtruck-list");

    try {
        // Fetch data from the API
        const response = await fetch("/api/foodtrucks");
        if (response.ok) {
            const foodTrucks = await response.json();

            // Clear the food truck list
            foodTruckList.innerHTML = "";

            // Populate the page with food truck data
            foodTrucks.forEach(truck => {
                const truckElement = document.createElement("div");
                truckElement.className = "foodtruck-item";
                truckElement.innerHTML = `
                    <h3>${truck.truckname}</h3>
                    <p>${truck.description || "No description available."}</p>
                    <p>Address: ${truck.address || "Not provided."}</p>
                    <a href="${truck.externalLink || "#"}" target="_blank">More Info</a>
                `;
                foodTruckList.appendChild(truckElement);
            });
        } else {
            foodTruckList.innerHTML = "<p>Failed to load food trucks. Please try again later.</p>";
        }
    } catch (error) {
        console.error("Error fetching food trucks:", error);
        foodTruckList.innerHTML = "<p>An error occurred while loading food trucks.</p>";
    }
});
