

/* Create the Grid



/*-------------------------------- Constants --------------------------------*/

const width = 10;
const cellCount = width * width;
const cells = [];
let numCells;
let squareClicked;
let currentShipButton;
let numShips = 0;
//These will be used to create the boat array of Objects
boat5 = [];
boat4 = [];
boat3 = [];
boat2 = [];




/*---------------------------- Variables (state) ----------------------------*/



/*------------------------ Cached Element References ------------------------*/
//Grid
const grid = document.querySelector('.grid');
//message
const messageEl = document.querySelector('#message');
//Ships
const shipsEls = document.querySelectorAll('.ship-btn');
//position-btn
const positionContainerEl = document.querySelector('.position-container');
//position button elements
const positionBtnEls = document.querySelectorAll('.position-btn');






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
    console.log('Boat has this many cells:', numCells);

    //changing message to show boat selected & now to select a square
    messageEl.textContent = 'Boat Selected, Pick a square you want to place it on'

    //disabling other boat buttons
    disableBtn(shipsEls, currentShipButton);

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

    //changing message to show boat selected & now to select a square
    messageEl.textContent = 'Boat and Square selected, Pick the position of the boat:'

    //remove the click Listener 
    grid.removeEventListener('click', squareClick);

    //showing the position buttons
    positionContainerEl.classList.toggle('hide');
    //Listening for the psotion button
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

    //If the boat fails to be placed keep the index's already placed
    const attemptedIndexes = [];

    if (positionChosen === 'Vertical') {

        for (let i = 0; i < shipCells; i++) {
            //new index shows if out of bounds ( error checking)
            const index = startIndex + (i * width);
            console.log(index);

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
        console.log(rowStart);

        for (let i = 0; i < shipCells; i++) {
            //new index to show if out of bounds or on different row ( error checking)
            const index = startIndex + i;
            console.log(index);

            //* This checks the index row is the same as the start row 
            // Math.floor(index / width) !== Math.floor(startIndex / width)
            console.log("row " + Math.floor(index / width) + "start row " + Math.floor(startIndex / width));

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

    //keeping track of number of successful sips placed
    numShips += 1;
    console.log(numShips);

    if (numShips === 4) {
        //add function to generate computer array
        //add function to startGame();
    }

    //save ship to correct array
    switch (parseInt(shipCells)) {
        case 5:
            boat5 = shipArray;
            break;
        case 4:
            boat4 = shipArray;
            break;
        case 3:
            boat3 = shipArray;
            break;
        case 2:
            boat2 = shipArray;
            break;
    }

    messageEl.textContent = 'Ship placed successfully!';

    nextShip();


}

//*Selecting another ship after first one is successful
const nextShip = () => {

    //clear squares selected. 
    cells.forEach(cell => cell.classList.remove('selected'));

    //Make your selection null
    squareClicked = null;

    console.log('here');

    //re-enable only unplaced ship buttons
    ableBtn(shipsEls);
    currentShipButton.disabled = true; // Ensure it stays disabled before going to next one.
    currentShipButton.classList.add('hide');

    //re-enabling psoition buttons
    ableBtn(positionBtnEls);
    // Hide position container
    positionContainerEl.classList.add('hide');

    // Prompt user to select next boat.
    messageEl.textContent = 'Select your next boat';

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
const ableBtn = (domElement) => {
    domElement.forEach((SelectedBtn) => {
        SelectedBtn.disabled = false;
    });
}


//* Reset Square Selection after failed boat attempt
function resetSquareSelection() {
    // Remove the 'selected' class from all cells
    cells.forEach(cell => cell.classList.remove('selected'));
    //  Clear the stored clicked square
    squareClicked = null;
    // enable the position buttons
    ableBtn(positionBtnEls);
    // (Re‑)attach the grid listener to select a new square
    grid.addEventListener('click', squareClick);
}



/*----------------------------- Event Listeners -----------------------------*/


shipsEls.forEach((ship) => {
    ship.removeEventListener('click', shipSelection);
    ship.addEventListener('click', shipSelection);
});



init();