# battleship-browser-game
Battleship Browser Game 

What I learned:
- Math.floor - Rounds a number down to nearest whole number
We can use this JS function to get the row number. If we have a grid and we need to ensure that something is not placed on a different row. We can use this function to stop that. 
You need width and index in order to calculate row.
width=10
index=23
row = Math.floor(index/width) - row 2