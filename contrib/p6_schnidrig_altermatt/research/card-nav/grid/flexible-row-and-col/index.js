const gridItems = {
    one: {
        row: 1,
        col: 2
    },
    two: {
        row: 2,
        col: 1
    },
    three: {
        row: 1,
        col: 1
    },
    four: {
        row: 2,
        col: 2
    }
};

const grid = document.getElementById("grid");

for (const key in gridItems) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("grid-item");
    itemDiv.style.cssText += "grid-row: span " + gridItems[key].row;
    itemDiv.style.cssText += "grid-column: span " + gridItems[key].col;
    itemDiv.append(key);
    grid.append(itemDiv);
}
