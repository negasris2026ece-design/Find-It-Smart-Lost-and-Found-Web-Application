// FindIt - Campus Lost & Found App

// Sample Items
const sampleItems = [
    {
        id: 1,
        name: "Blue Water Bottle",
        category: "Others",
        location: "College Library",
        type: "Found",
        description: "A blue water bottle found near the library.",
        claimed: false
    },
    {
        id: 2,
        name: "College ID Card",
        category: "Documents",
        location: "Computer Lab",
        type: "Lost",
        description: "Student ID card lost in the computer lab.",
        claimed: false
    }
];

// Load saved items from LocalStorage
let items = JSON.parse(localStorage.getItem("finditItems")) || sampleItems;

let currentFilter = "All";

// Save items
function saveItems() {
    localStorage.setItem("finditItems", JSON.stringify(items));
}

// Show Report Form
function showForm() {
    document.getElementById("reportForm").classList.remove("hidden");
}

// Hide Report Form
function hideForm() {
    document.getElementById("reportForm").classList.add("hidden");
}

// Submit Report
document.getElementById("itemForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const newItem = {
        id: Date.now(),
        name: document.getElementById("itemName").value.trim(),
        category: document.getElementById("category").value,
        location: document.getElementById("location").value.trim(),
        type: document.getElementById("type").value,
        description: document.getElementById("description").value.trim(),
        claimed: false
    };

    items.unshift(newItem);

    saveItems();

    displayItems();

    document.getElementById("itemForm").reset();

    hideForm();

    alert("Your report has been submitted successfully!");
});

// Filter Items
function filterItems(type) {
    currentFilter = type;
    displayItems();
}

// Mark Item as Claimed
function claimItem(id) {

    const item = items.find(item => item.id === id);

    if (item) {
        item.claimed = !item.claimed;
        saveItems();
        displayItems();
    }
}

// Display Items
function displayItems() {

    const itemsList = document.getElementById("itemsList");

    const searchText = document.getElementById("searchInput")
        .value.toLowerCase().trim();

    itemsList.innerHTML = "";

    const filteredItems = items.filter(item => {

        const matchesSearch =
            item.name.toLowerCase().includes(searchText) ||
            item.location.toLowerCase().includes(searchText);

        const matchesFilter =
            currentFilter === "All" || item.type === currentFilter;

        return matchesSearch && matchesFilter;
    });

    if (filteredItems.length === 0) {
        itemsList.textContent = "No items found.";
        return;
    }

    filteredItems.forEach(item => {

        const card = document.createElement("div");
        card.className = "item-card";

        if (item.claimed) {
            card.classList.add("claimed");
        }

        const title = document.createElement("h3");
        title.textContent = item.name;

        const category = document.createElement("p");
        category.textContent = "Category: " + item.category;

        const location = document.createElement("p");
        location.textContent = "Location: " + item.location;

        const type = document.createElement("p");
        type.textContent = "Status: " + item.type;

        const description = document.createElement("p");
        description.textContent = "Description: " + item.description;

        const claimedStatus = document.createElement("p");
        claimedStatus.textContent = item.claimed
            ? "Claimed"
            : "Not yet claimed";

        const button = document.createElement("button");
        button.textContent = item.claimed
            ? "Undo Claim"
            : "Mark as Claimed";

        button.addEventListener("click", function() {
            claimItem(item.id);
        });

        card.append(
            title,
            category,
            location,
            type,
            description,
            claimedStatus,
            button
        );

        itemsList.appendChild(card);
    });
}

// Search Items
document.getElementById("searchInput").addEventListener("input", function() {
    displayItems();
});

// Initial Display
displayItems();
// Register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(() => console.log("FindIt app is ready!"))
            .catch(error =>
                console.log("Service worker error:", error)
            );
    });
}