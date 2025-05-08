# battleship-browser-game
Battleship Browser Game 

What I learned:
- Math.floor - Rounds a number down to nearest whole number
We can use this JS function to get the row number. If we have a grid and we need to ensure that something is not placed on a different row. We can use this function to stop that. 
You need width and index in order to calculate row.
width=10
index=23
row = Math.floor(index/width) - row 2

- Set - is a special list that only stores unique values (no duplicates allowed) and faster when you want to check something is in a list. 
example:
const mySet = new Set();

mySet.add(3); // adds 3
mySet.add(3); // does nothing because 3 is already in the set

console.log(mySet.has(3)); // true
console.log(mySet.has(5)); // false

- Do..While loop 
The do...while loop is a control structure that runs the block of code once first, and then keeps running it as long as a condition is true. It's useful when you want to guarantee that the code inside runs at least once, even if the condition is false the first time.
example :
let number;

do {
  number = Math.floor(Math.random() * 10);
  console.log("Picked:", number);
} while (number !== 5);

- Object.values(ships)
This takes the object ships (e.g., playerShips or computerShips) and returns an array of all the ship arrays.
ships 
before:
{
  ship1: [{ cellNumber: 3, hit: true }, { cellNumber: 4, hit: true }],
  ship2: [{ cellNumber: 10, hit: true }, { cellNumber: 11, hit: false }]
}

after: gives us an array we can loop through 
{
  ship1: [{ cellNumber: 3, hit: true }, { cellNumber: 4, hit: true }],
  ship2: [{ cellNumber: 10, hit: true }, { cellNumber: 11, hit: false }]
}
