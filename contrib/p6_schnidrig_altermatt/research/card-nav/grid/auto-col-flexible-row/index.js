const gridItems = {
    one: "2",
    two: "1",
    four: "2",
    three: "1"
};

const grid = document.getElementById("grid");

for (const key in gridItems) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("grid-item");
    itemDiv.style.cssText += "grid-row: span " + gridItems[key];
    itemDiv.append(key);
    grid.append(itemDiv);
}
