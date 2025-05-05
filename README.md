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
