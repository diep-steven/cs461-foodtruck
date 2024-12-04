function loadMenu(truckId) {
    fetch(`/menu/${truckId}`)
        .then(response => response.json())
        .then(menuItems => {
            const menuContainer = document.getElementById(`menu-${truckId}`);
            let menuHtml = '<table><thead><tr><th>Food Item</th><th>Price</th></tr></thead><tbody>';
            menuItems.forEach(item => {
                menuHtml += `<tr><td>${item.foodName}</td><td>$${item.itemPrice.toFixed(2)}</td></tr>`;
            });
            menuHtml += '</tbody></table>';
            menuContainer.innerHTML = menuHtml;
        })
        .catch(error => {
            console.error("Error loading menu:", error);
        });
}
