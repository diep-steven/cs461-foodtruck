document.addEventListener("DOMContentLoaded", () => {
    // Add event listener for the "View Menu" button
    const menuButton = document.querySelector(".menu-button");

    if (menuButton) {
        menuButton.addEventListener("click", async (event) => {
            const truckId = event.target.getAttribute("data-truckid");  // Get the truckId from the button's data attribute
            if (truckId) {
                // Redirect to the menu page for the specific truck
                window.location.href = `/truck/${truckId}/menu`;  // Redirect to the menu page
            } else {
                console.error("Truck ID not found");
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Add event listener for the "View Menu" button
    const openingHoursButton = document.querySelector(".openingHours-button");

    if (openingHoursButton) {
        openingHoursButton.addEventListener("click", async (event) => {
            const truckId = event.target.getAttribute("data-truckid");  // Get the truckId from the button's data attribute
            if (truckId) {
                // Redirect to the menu page for the specific truck
                window.location.href = `/truck/${truckId}/openingHours`;  // Redirect to the menu page
            } else {
                console.error("Truck ID not found");
            }
        });
    }
});
