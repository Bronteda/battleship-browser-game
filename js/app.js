

/* Create the Grid



/*-------------------------------- Constants --------------------------------*/

const width = 10;
const cellCount = width * width;
const cells = [];
//These will be used to create the boat array of Objects
boat5 = [];
boat4 = [];
boat3 = [];
boat2 = [];




/*---------------------------- Variables (state) ----------------------------*/



/*------------------------ Cached Element References ------------------------*/
//Grab grid
const grid = document.querySelector('.grid');
const rightPanelEls = document.querySelector('.right-panel');
console.log(rightPanelEls);



/*-------------------------------- Functions --------------------------------*/
//Create grid
const createGrid = (() => {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.innerText = i;
        cells.push(cell);
        grid.appendChild(cell);
    }
});

const selectBoat = ((event) => {
    console.log(event.target.id);
});


/*----------------------------- Event Listeners -----------------------------*/
//When a boat is selected
rightPanelEls.addEventListener('click', selectBoat);


createGrid();
