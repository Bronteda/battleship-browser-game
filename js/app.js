

/* Create the Grid



/*-------------------------------- Constants --------------------------------*/

const width = 10;
const cellCount = width * width;
const cells = [];
let numCells;
let squareClicked;
let currentShipButton;
let numShips = 0;
//These will be used to create the Ship array of Objects
let playerShips = {
    ship5: [],
    ship4: [],
    ship3: [],
    ship2: [],
};
let computerShips = {
    ship5: [],
    ship4: [],
    ship3: [],
    ship2: [],
}




/*---------------------------- Variables (state) ----------------------------*/



/*------------------------ Cached Element References ------------------------*/
//Grid
const grid = document.querySelector('.grid');
//message at the top
const messageEl = document.querySelector('#message');
//Ships
const shipBtnEls = document.querySelectorAll('.ship-btn');
//position-btn
const positionContainerEl = document.querySelector('.position-container');
//position button elements
const positionBtnEls = document.querySelectorAll('.position-btn');
//Add select Ship message 
const SelectShipMessageEl = document.querySelector('.selectShipMessage')
//Game button elements - let's play & reposition
const gameBtnConatinerEls = document.querySelector('.gameBtnConatiner')






/*-------------------------------- Functions --------------------------------*/
const init = (() => {
    createGrid();

});

//*Grid Created
const createGrid = (() => {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.innerText = i;
        cells.push(cell);
        grid.appendChild(cell);
    }
});


//*Ship Selected
const shipSelection = ((event) => {
    currentShipButton = event.target;
    numCells = event.target.id;
    console.log('Ship has this many cells:', numCells);

    //changing message to show Ship selected & now to select a square
    messageEl.textContent = 'Ship Selected, Pick a square you want to place it on'

    //disabling other f buttons
    disableBtn(shipBtnEls, currentShipButton);

    //Remove the listener on the first button
    currentShipButton.removeEventListener('click', shipSelection);

    //attaching the square listener
    grid.addEventListener('click', squareClick);

});

//*Square selected
const squareClick = (sqEvent) => {
    squareClicked = sqEvent.target;
    console.log('You clicked square:', squareClicked);

    //showing the square selected
    squareClicked.classList.add('selected');

    //changing message to show Ship selected & now to select a square
    messageEl.textContent = 'Ship and Square selected, Pick the position of the Ship:'

    //remove the click Listener 
    grid.removeEventListener('click', squareClick);

    //showing the position buttons
    positionContainerEl.classList.toggle('hide');
    //Listening for the position button
    positionContainerEl.addEventListener('click', positionClick);
};

//*Position selected
const positionClick = (event) => {
    const positionSelected = event.target.innerText;
    const positionBtn = event.target;
    console.log(positionSelected);
    disableBtn(positionBtnEls, positionBtn);

    placeShipOnBoard(numCells, squareClicked, positionSelected);

    //Remove the listener
    positionContainerEl.removeEventListener('click', positionClick);

};


//*Place Ship on Grid
const placeShipOnBoard = (shipCells, startSquare, positionChosen) => {
    //Temp ship array
    const shipArray = [];

    // Convert the square (a DOM element) to its index in the grid
    const startIndex = cells.indexOf(startSquare);

    //If the Ship fails to be placed keep the index's already placed
    const attemptedIndexes = [];

    if (positionChosen === 'Vertical') {

        for (let i = 0; i < shipCells; i++) {
            //new index shows if out of bounds ( error checking)
            const index = startIndex + (i * width);

            if (index >= cellCount ||
                cells[index] === undefined ||
                cells[index].classList.contains('ship') // if ship is placed on another
            ) {
                messageEl.textContent = 'Ship overlaps another or would go off the board. Please pick another square.';

                //  Remove any temporarily added 'ship' classes
                attemptedIndexes.forEach(i => cells[i].classList.remove('ship'));

                //  Reset the square‑selection UI & state
                resetSquareSelection();

                // Hide position buttons again
                positionContainerEl.classList.add('hide');
                return;
            } else {
                attemptedIndexes.push(index);
                shipArray.push({ cellNumber: index, hit: false });
                cells[index].classList.add('ship'); //to show the ship
            }

        }

    } else if (positionChosen === 'Horizontal') {
        const rowStart = Math.floor(startIndex / width) * width;

        for (let i = 0; i < shipCells; i++) {
            //new index to show if out of bounds or on different row ( error checking)
            const index = startIndex + i;

            //* This checks the index row is the same as the start row 
            // Math.floor(index / width) !== Math.floor(startIndex / width)
            if (index >= cellCount ||
                Math.floor(index / width) !== Math.floor(startIndex / width) ||
                cells[index].classList.contains('ship') // if ship is placed on another
            ) {
                messageEl.textContent = 'Ship overlaps another or would go off the board. Please pick another square.';

                //  Remove any temporarily added 'ship' classes
                attemptedIndexes.forEach(i => cells[i].classList.remove('ship'));

                //  Reset the square‑selection UI & state
                resetSquareSelection();

                // Hide position buttons again
                positionContainerEl.classList.add('hide');
                return;
            } else {
                attemptedIndexes.push(index);
                shipArray.push({ cellNumber: index, hit: false });
                cells[index].classList.add('ship'); //to show the ship
            }
        }
    }

    //save ship to correct array
    switch (parseInt(shipCells)) {
        case 5:
            playerShips.ship5 = shipArray;
            break;
        case 4:
            playerShips.ship4 = shipArray;
            break;
        case 3:
            playerShips.ship3 = shipArray;
            break;
        case 2:
            playerShips.ship2 = shipArray;
            break;
    }

    //console.log(playerShips);

    messageEl.textContent = 'Ship placed successfully!';

    //keeping track of number of successful sips placed
    numShips += 1;

    if (numShips < 4) {
        nextShip();
    } else {
        messageEl.textContent = 'All Ships Placed Successfully.';

        //clear squares selected. 
        cells.forEach(cell => cell.classList.remove('selected'));

        //re-enable only unplaced ship buttons
        enableBtn(shipBtnEls);
        currentShipButton.disabled = true;
        currentShipButton.classList.add('hide');

        //re-enabling position buttons
        enableBtn(positionBtnEls);
        positionContainerEl.classList.add('hide');

        //Hide the select Ship message
        SelectShipMessageEl.classList.add('hide');

        //Shows the game buttons on screen
        gameBtnConatinerEls.classList.toggle('hide');

        generateComputerSide();
        //add function to generate computer array
        //add function to startGame();   
    }
}

//*Selecting another ship after first one is successful
const nextShip = () => {

    //clear squares selected. 
    cells.forEach(cell => cell.classList.remove('selected'));

    //Make your selection null
    squareClicked = null;

    //re-enable only unplaced ship buttons
    enableBtn(shipBtnEls);
    currentShipButton.disabled = true; // Ensure it stays disabled before going to next one.
    currentShipButton.classList.add('hide');

    //re-enabling psoition buttons
    enableBtn(positionBtnEls);
    // Hide position container
    positionContainerEl.classList.add('hide');

    // Prompt user to select next Ship.
    messageEl.textContent = 'Select your next Ship';

}


//*Generates Computers board layout randomly
const generateComputerSide = () => {
    const shipsLengths = [5, 4, 3, 2];

    // This will store every cell that's already taken by a ship
    const takenCells = new Set();

    //Loop through each ship size 
    for (let size of shipsLengths) {
        let shipPlaced = false; // this keeps trying until ship placed

        while (!shipPlaced) {
            //Randomly chooses between Horizontal & Vertical
            const orientation = Math.random() < 0.5 ? 'Horizontal' : 'Vertical';
            //random start index 
            const randomIndex = Math.floor(Math.random() * cellCount);

            //This is like the attempted indexes to see if ship fits
            const proposedCells = [];
            //assume it fits unless there is a problem
            let fits = true;


            //Try build the ship
            for (i = 0; i < size; i++) {
                let index;

                if (orientation === 'Horizontal') {
                    index = randomIndex + i;

                    const startRow = Math.floor(randomIndex / width);
                    const currentRow = Math.floor(index / width);

                    //check if ship moves to a new row or is off the board
                    if (
                        index >= cellCount || //off the board
                        currentRow !== startRow || // same row 
                        takenCells.has(index) // ship already taken

                    ) {
                        fit = false;
                        break;//stop ship from being built

                    }
                } else {
                    // Vertical 

                    //move down the column
                    index = randomIndex + (i * width);
                    if (
                        index >= cellCount || //off board
                        takenCells.has(index) //already has a ship
                    ) {
                        fits = false;
                        break;
                    }
                }

                proposedCells.push(index);


                if (fits) {

                    // Mark these cells as taken
                    for (let cell of proposedCells) {
                        takenCells.add(cell);
                    }
                }

                // Create ship object from cells
                const ship = [];
                for (let j = 0; j < proposedCells.length; j++) {
                    ship.push({
                        cellNumber: proposedCells[j],
                        hit: false
                    });
                }

                // Save to correct ship slot
                switch (size) {
                    case 5:
                        computerShips.boat5 = ship;
                        break;
                    case 4:
                        computerShips.boat4 = ship;
                        break;
                    case 3:
                        computerShips.boat3 = ship;
                        break;
                    case 2:
                        computerShips.boat2 = ship;
                        break;
                }

                shipPlaced = true;
            }

        }

    }
    console.log(computerShips);
}

//*Additional functions

//This disables the other buttons once one is selected
const disableBtn = (domElement, selectedEl) => {
    domElement.forEach((notSelectedBtn) => {
        if (notSelectedBtn !== selectedEl) {
            notSelectedBtn.disabled = true;
        } else {
            selectedEl.disabled = false;
        }
    });
}

//makes the buttons enabled again
const enableBtn = (domElement) => {
    domElement.forEach((SelectedBtn) => {
        SelectedBtn.disabled = false;
    });
}


//* Reset Square Selection after failed Ship attempt
function resetSquareSelection() {
    // Remove the 'selected' class from all cells
    cells.forEach(cell => cell.classList.remove('selected'));
    //  Clear the stored clicked square
    squareClicked = null;
    // enable the position buttons
    enableBtn(positionBtnEls);
    // (Re‑)attach the grid listener to select a new square
    grid.addEventListener('click', squareClick);
}



/*----------------------------- Event Listeners -----------------------------*/


shipBtnEls.forEach((ship) => {
    ship.removeEventListener('click', shipSelection);
    ship.addEventListener('click', shipSelection);
});



init();