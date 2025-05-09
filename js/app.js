
const width = 10;
const cellCount = width * width;
//Holds all values in the grid - Can be used to clear classes 
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
//Keep score of how many ships sunk to determine the winner
let playerScore = 0;
let computerScore = 0;
let turn;
let gameOver = false;


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
//right panel
const rightPanelEl = document.querySelector(".right-panel");
//left panel
const leftPanelEl = document.querySelector(".left-panel");
//Add select Ship message 
const SelectShipMessageEl = document.querySelector('.selectShipMessage');
//Game button elements - let's play & reposition
const gameBtnConatinerEls = document.querySelector('.gameBtnConatiner');
//Play Again button
const playAagainBtnEl = document.querySelector('.playAgainBtn');
//re do button - basically resets board anytime during the game
const redoBtnEl = document.querySelector(".redoBtn");
//Scores
const scoresConatinerel = document.querySelector('.scores');
const playerScoreEl = document.querySelector('#PlayerScore');
const computerScoreEl = document.querySelector('#ComputerScore');



/*-------------------------------- Functions --------------------------------*/

//When window loads
window.addEventListener('DOMContentLoaded', () => {
    const startModal = document.getElementById('startModal');
    const startButton = document.getElementById('startGameBtn');

    startButton.addEventListener('click', () => {
        startModal.style.display = 'none';
        init();
    });
});

//Initializing the game
const init = (() => {
    createGrid();
    shipBtnEls.forEach((ship) => {
        ship.removeEventListener('click', shipSelection);
        ship.addEventListener('click', shipSelection);
    });

    redoBtnEl.addEventListener('click', ()=>{
        location.reload();
    });
});

//*Grid Created
const createGrid = (() => {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        //cell.innerText = i;
        cells.push(cell);
        grid.appendChild(cell);
    }
});


//*Ship Selected
const shipSelection = ((event) => {
    currentShipButton = event.target;
    console.log(currentShipButton);
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

    //Makes sure the correct element is being clicked on
    if (!positionBtn.classList.contains('position-btn')) {
        return;
    }

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
                cells[index].classList.contains('player-ship') // if ship is placed on another
            ) {
                messageEl.textContent = 'Ship overlaps another or would go off the board. Please pick another square.';

                //  Remove any temporarily added 'player-ship' classes
                attemptedIndexes.forEach(i => cells[i].classList.remove('player-ship'));

                //  Reset the square‑selection UI & state
                resetSquareSelection();

                // Hide position buttons again
                positionContainerEl.classList.add('hide');
                return;
            } else {
                attemptedIndexes.push(index);
                shipArray.push({ cellNumber: index, hit: false });
                cells[index].classList.add('player-ship'); //to show the ship
            }

        }

    } else if (positionChosen === 'Horizontal') {

        for (let i = 0; i < shipCells; i++) {
            //new index to show if out of bounds or on different row ( error checking)
            const index = startIndex + i;

            const startRow = Math.floor(startIndex / width);
            const currentRow = Math.floor(index / width);

            //* This checks the index row is the same as the start row 
            // Math.floor(index / width) !== Math.floor(startIndex / width)
            if (index >= cellCount ||
                currentRow !== startRow ||
                cells[index].classList.contains('player-ship') // if ship is placed on another
            ) {
                messageEl.textContent = 'Ship overlaps another or would go off the board. Please pick another square.';

                //  Remove any temporarily added 'player-ship' classes
                attemptedIndexes.forEach(i => cells[i].classList.remove('player-ship'));

                //  Reset the square‑selection UI & state
                resetSquareSelection();

                // Hide position buttons again
                positionContainerEl.classList.add('hide');
                return;
            } else {
                attemptedIndexes.push(index);
                shipArray.push({ cellNumber: index, hit: false });
                cells[index].classList.add('player-ship'); //to show the ship
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

        //add function to generate computer array
        generateComputerSide();

        //Reposition function 
        gameBtnConatinerEls.addEventListener('click', handleGameOptions);

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
                        fits = false;
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
            }

            if (fits) {

                // Mark these cells as taken
                for (let cell of proposedCells) {
                    takenCells.add(cell);
                }
                //This is just for testing purposes to see if ships boats fall on the grid correctly 
                proposedCells.forEach(i => {
                    cells[i].classList.add('computer-ship');
                });


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
                        computerShips.ship5 = ship;
                        break;
                    case 4:
                        computerShips.ship4 = ship;
                        break;
                    case 3:
                        computerShips.ship3 = ship;
                        break;
                    case 2:
                        computerShips.ship2 = ship;
                        break;
                }

                shipPlaced = true;
            }
        }
    }
}

const handleGameOptions = (event) => {
    const optionBtn = event.target;

    if (!optionBtn.classList.contains('gameBtn')) {
        return;
    }

    if (optionBtn.classList.contains('playBtn')) {
        //Play Function 
        gamePlay();
        scoresConatinerel.classList.toggle('hide');
    } else {
        //reset Board
        reshuffleShips();
    }
}

const gamePlay = () => {

    //*Reset the Board
    //Need to remove all cells with ship class 
    cells.forEach((cell) => {
        cell.classList.remove('player-ship');
        cell.classList.remove('selected');
    });

    //Display a message 
    messageEl.textContent = 'Please select a square to bomb';

    //Hide game options
    gameBtnConatinerEls.classList.toggle('hide');


    //Add the event listener to the grid again to see what the user selects
    grid.addEventListener('click', processMove);


}

const processMove = (event) => {
    //Show the DOM square selected 
    let squareDOM = event.target;
    //change the dom value into the index in the cells
    let squareIndex = cells.indexOf(squareDOM);

    //Safety check if square not found
    if (squareIndex === -1) return;

    //If game over flag is true
    if (gameOver) return;

    // Already been clicked?
    if (squareDOM.classList.contains('player-hit') || squareDOM.classList.contains('player-miss')) return;

    let hitShip = null;

    // Loop through all ships to find which one includes this square
    for (let shipKey in computerShips) {
        //ShipKey is ship5 or ship4
        const ship = computerShips[shipKey];
        //ship is the object of that certain ship

        hitShip = ship.find(cell => cell.cellNumber === squareIndex);

        //check if found something
        if (hitShip) {
            hitShip.hit = true;
            messageEl.textContent = 'You hit a ship';
            //Show on Board you hit a ship. 
            squareDOM.classList.add('player-hit');
            checkIfShipSunk(ship, turn);
            break;
        }
    }

    if (!hitShip) {
        messageEl.textContent = "You missed";
        //Show on Board you missed a ship. 
        squareDOM.classList.add('player-miss');
    }

    turn = 'computer'
    grid.removeEventListener('click', processMove);
    setTimeout(computersTurn, 1200); //delaying for realism 

}

const computersTurn = () => {

    //If game over flag is true 
    if (gameOver) return;

    messageEl.textContent = "Computers Turn";

    let randomIndex;
    let randomSquare;

    // Loop until a valid square is found
    do {
        randomIndex = Math.floor(Math.random() * cellCount);
        randomSquare = cells[randomIndex];
        console.log('Random Square Index:', randomIndex, 'Square:', randomSquare);
    } while (
        randomSquare.classList.contains('computer-hit') ||
        randomSquare.classList.contains('computer-miss')
    );

    // Prepare message
    let message = "Computer's Turn. ";

    let hitShip = null;
    //Show on Board you hit a ship. 

    // Loop through all ships to find which one includes this square
    for (let shipKey in playerShips) {
        //ShipKey is ship5 or ship4
        let ship = playerShips[shipKey];
        //ship is the object of that certain ship

        hitShip = ship.find(cell => cell.cellNumber === randomIndex);

        if (hitShip) {
            hitShip.hit = true;
            messageEl.textContent = 'Computer has hit your ship';
            console.log('Computer hit ship at index:', randomIndex);
            randomSquare.classList.add('computer-hit');
            checkIfShipSunk(ship, turn); // call it here, once you know which ship it is
            break; // no need to keep checking
        }
    }
    if (!hitShip) {
        message += "It missed";
        //Show on Board you missed a ship. 
        randomSquare.classList.add('computer-miss');
    }

    messageEl.textContent = message;

    turn = 'player'; // Switch to player’s turn
    setTimeout(() => {
        messageEl.textContent = "Your Turn. Choose a square."; // Inform player it’s their turn
        grid.addEventListener('click', processMove); // Enable player clicks again
    }, 1200); // Delay before showing the "Your Turn" message
}

const checkIfShipSunk = (ship, gameTurn) => {
    //this check thats each ships Hit featur is true
    const isSunk = ship.every(cell => cell.hit);

    if (isSunk) {
        if (gameTurn === 'player') {
            messageEl.textContent = 'You sunk the computers Ship';

            //Mark all ships that are sunk with a different class 
            for (let cell of ship) {
                cells[cell.cellNumber].classList.add('sunk');
            }

            playerScore += 1;
            playerScoreEl.textContent = `Player Score = ${playerScore} `;
            if (checkIfAllSunk(gameTurn)) {
                messageEl.textContent = "Well Done, You Won !!🥳"
                gameOver = true; // prevent further moves
                setTimeout(() => {
                    confetti(); // default burst
                }, 500);

                playAagainBtnEl.classList.toggle('hide');
                playAagainBtnEl.addEventListener('click', resetTheBoard);
            }

        } else {
            messageEl.textContent = 'The Computer sank your ship';

            computerScore += 1;
            computerScoreEl.textContent = `Computers Score = ${computerScore} `;

            if (checkIfAllSunk(gameTurn)) {
                messageEl.textContent = "Sorry you lose, Computer Won 💻"
                gameOver = true; // prevent further moves
                playAagainBtnEl.classList.toggle('hide');
                playAagainBtnEl.addEventListener('click', resetTheBoard);
            }
        }

    }

}

const checkIfAllSunk = (turn) => {

    //condition ? valueIfTrue : valueIfFalse
    const ships = turn === 'player' ? computerShips : playerShips;

    //This checks that every ship has all its cells marked as hit
    return Object.values(ships).every(ship => ship.every(cell => cell.hit));

};


//*Additional functions


const reshuffleShips = () => {

    //Need to remove all cells with ship class 
    cells.forEach((cell) => {
        cell.classList.remove('player-ship');
        cell.classList.remove('selected');
        cell.classList.remove('computer-ship');
        cell.classList.remove('player-hit', 'player-miss', 'sunk');
        cell.classList.remove('computer-hit', 'computer-miss');
    });

    //Bring back the ship buttons
    shipBtnEls.forEach((shipBtn) => {
        shipBtn.disabled = false;
        shipBtn.classList.remove('hide');
        shipBtn.addEventListener('click', shipSelection);
    });

    numCells = null;
    numShips = null;
    squareClicked = null;
    currentShipButton = null;

    //Remove the player side as well 
    playerShips.ship5 = [];
    playerShips.ship4 = [];
    playerShips.ship3 = [];
    playerShips.ship2 = [];

    //Remove the computer side as well 
    computerShips.ship5 = [];
    computerShips.ship4 = [];
    computerShips.ship3 = [];
    computerShips.ship2 = [];

    //Hide the game options again
    gameBtnConatinerEls.classList.toggle('hide');

    //Show messsage again
    SelectShipMessageEl.classList.toggle('hide');

    //Display the start message
    messageEl.textContent = 'Select a Ship to Place on the grid';

}
//Reset the board 
const resetTheBoard = () => {
    //reset the board 


    //Need to remove all cells with ship class 
    cells.forEach((cell) => {
        cell.classList.remove('player-ship');
        cell.classList.remove('selected');
        cell.classList.remove('computer-ship');
        cell.classList.remove('player-hit', 'player-miss', 'sunk');
        cell.classList.remove('computer-hit', 'computer-miss');
    });

    //Bring back the ship buttons
    shipBtnEls.forEach((shipBtn) => {
        shipBtn.disabled = false;
        shipBtn.classList.remove('hide');
        shipBtn.addEventListener('click', shipSelection);
    });

    numCells = null;
    numShips = null;
    squareClicked = null;
    currentShipButton = null;
    turn = null;

    //Remove the player side as well 
    playerShips.ship5 = [];
    playerShips.ship4 = [];
    playerShips.ship3 = [];
    playerShips.ship2 = [];

    //Remove the computer side as well 
    computerShips.ship5 = [];
    computerShips.ship4 = [];
    computerShips.ship3 = [];
    computerShips.ship2 = [];

    //score reset
    playerScore = 0;
    computerScore = 0;
    playerScoreEl.textContent = 'Player Score = 0';
    computerScoreEl.textContent = 'Computer Score = 0';
    scoresConatinerel.classList.toggle('hide');

    //game flag
    gameOver = false;

    //hide other buttons
    playAagainBtnEl.classList.toggle('hide');
    gameBtnConatinerEls.classList.toggle('hide');

    //Hide the game options again
    gameBtnConatinerEls.classList.toggle('hide');

    //Show message again
    SelectShipMessageEl.classList.toggle('hide');

    //Display the start message
    messageEl.textContent = 'Select a Ship to Place on the grid';
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
