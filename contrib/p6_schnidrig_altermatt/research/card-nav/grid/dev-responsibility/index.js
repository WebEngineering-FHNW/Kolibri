const gridItems = {
    one: "1/1 / 2/1",
    two: "2/3 / 2/4",
    three: "1/2 / 1/3",
    four: "3/3 / 7/7"
};

const grid = document.getElementById("grid");

for (const key in gridItems) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("grid-item");
    itemDiv.style.cssText += "grid-area:" + gridItems[key];
    itemDiv.append(key);
    grid.append(itemDiv);
}
