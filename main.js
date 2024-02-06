// Define the grid size
const gridSize = 4;

// Define global variables: the number of moves and the timer
let moveCounter = 0;
let timer = null;
let secondsPassed = 0;

// Function to update the HTML elements representing the grid cells
function initializeGrid() {
    const grid = document.getElementsByClassName("cell");
    for (let i = 0; i < gridSize * gridSize; i++) {
        if (i === gridSize * gridSize - 1) {
            grid[i].textContent = "x";
            grid[i].classList.add("empty");
        } else {
            grid[i].textContent = i + 1;
            grid[i].classList.remove("empty");
        }
    }
}

// Function to update grid with slide animation
function updateGrid() {
    const grid = document.getElementsByClassName("cell");
    for (let i = 0; i < gridSize * gridSize; i++) {
        if (grid[i].textContent === "x") {
            grid[i].classList.add("empty");
        } else {
            grid[i].classList.remove("empty");
            if (parseInt(grid[i].textContent) === i + 1) {
                grid[i].classList.add("correct");
            } else {
                grid[i].classList.remove("correct");
            }
        }
    }
}

function updateMoveCounter() {
    moveCounter++;
    document.getElementById("moveCounter").textContent = moveCounter;
}

function isSolved() {
    const grid = document.getElementsByClassName("cell");
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].textContent === "x") {
            if (i !== grid.length - 1) {
                return false;
            }
        } else {
            if (parseInt(grid[i].textContent) !== i + 1) {
                return false;
            }
        }
    }
    return true;
}

// Function to move a cell with slide animation
function moveCellWithAnimation(direction) {
    const grid = document.getElementsByClassName("cell");
    let emptyCellIndex = -1;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].textContent === "x") {
            emptyCellIndex = i;
            break;
        }
    }

    let emptyCellRow = Math.floor(emptyCellIndex / gridSize);
    let emptyCellCol = emptyCellIndex % gridSize;
    let targetIndex = -1;

    // Determine the target cell to swap with the empty cell based on the direction
    switch (direction) {
        case "up":
            if (emptyCellRow < gridSize - 1) {
                targetIndex = emptyCellIndex + gridSize;
            }
            break;
        case "down":
            if (emptyCellRow > 0) {
                targetIndex = emptyCellIndex - gridSize;
            }
            break;
        case "left":
            if (emptyCellCol < gridSize - 1) {
                targetIndex = emptyCellIndex + 1;
            }
            break;
        case "right":
            if (emptyCellCol > 0) {
                targetIndex = emptyCellIndex - 1;
            }
            break;
    }

    if (targetIndex !== -1) {

        // Swap the text content of the target cell and the empty cell
        [grid[emptyCellIndex].textContent, grid[targetIndex].textContent] =
            [grid[targetIndex].textContent, grid[emptyCellIndex].textContent];
        
        // Update the grid with the new cell arrangement
        updateGrid();
        updateMoveCounter();
        
        // Start the timer if it's the first move
        if (moveCounter === 1) {
            startTimer();
        }

        // Check if solved
        if (isSolved()) {
            stopTimer();
            alert("Congratulations! You solved the puzzle in " + moveCounter + " moves and " + document.getElementById("timer").textContent + "!");
        }
    }
}

// Function to move a cell using keyboard
function moveCellWithKeyboard(event) {
    switch (event.key) {
        case "ArrowUp":
            moveCellWithAnimation("down"); // Inverted since moving the empty cell down simulates moving a cell up
            break;
        case "ArrowDown":
            moveCellWithAnimation("up"); // Inverted for similar reason
            break;
        case "ArrowLeft":
            moveCellWithAnimation("right"); // Inverted
            break;
        case "ArrowRight":
            moveCellWithAnimation("left"); // Inverted
            break;
    }
}

function moveCellWithMouse() {
    const grid = document.getElementsByClassName("cell");
    for (let i = 0; i < grid.length; i++) {
        grid[i].addEventListener("click", function () {
            let emptyCellIndex = -1;
            for (let j = 0; j < grid.length; j++) {
                if (grid[j].textContent === "x") {
                    emptyCellIndex = j;
                    break;
                }
            }

            let emptyCellRow = Math.floor(emptyCellIndex / gridSize);
            let emptyCellCol = emptyCellIndex % gridSize;
            let targetIndex = i;
            let targetRow = Math.floor(targetIndex / gridSize);
            let targetCol = targetIndex % gridSize;

            if (Math.abs(emptyCellRow - targetRow) + Math.abs(emptyCellCol - targetCol) === 1) {
                [grid[emptyCellIndex].textContent, grid[targetIndex].textContent] =
                    [grid[targetIndex].textContent, grid[emptyCellIndex].textContent];
                updateGrid();
                updateMoveCounter();
        
                // Start the timer if it's the first move
                if (moveCounter === 1) {
                    startTimer();
                }

                // Check if the puzzle is solved
                if (isSolved()) {
                    stopTimer();
                    alert("Congratulations! You solved the puzzle in " + moveCounter + " moves and " + document.getElementById("timer").textContent + "!");
                }
            }
        });
    }
}

function startTimer() {
    stopTimer(); // Stop any existing timer
    secondsPassed = 0;
    timer = setInterval(function() {
        secondsPassed++;
        const minutes = Math.floor(secondsPassed / 60);
        const seconds = secondsPassed % 60;
        document.getElementById("timer").textContent = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    }, 1000);
}

function stopTimer() {
    if (timer !== null) {
        clearInterval(timer);
    }
}

function resetGame() {
    initializeGrid(); // Or however you set your grid to its initial state
    moveCounter = 0;
    document.getElementById("moveCounter").textContent = moveCounter;
    stopTimer();
    secondsPassed = 0;
    document.getElementById("timer").textContent = "00:00";
}

function shuffleGrid() {
    // Get all the grid cells
    let gridCells = document.getElementsByClassName("cell");
    
    do {
        // Shuffle using Fisher-Yates algorithm
        let nums = [];
        for (let i = 0; i < gridCells.length; i++) {
            nums.push(i);
        }

        for (let i = gridCells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }

        // Update the grid with the shuffled indexes
        for (let i = 0; i < gridCells.length; i++) {
            if (nums[i] + 1 === gridCells.length) {
                gridCells[i].textContent = "x";
                gridCells[i].classList.add("empty");
            } else {
                gridCells[i].textContent = nums[i] + 1;
                gridCells[i].classList.remove("empty");
            }
        }

        // If the puzzle is not solvable, shuffle again until it is
    } while (!checkIfSolvable(Array.from(gridCells).map(cell => cell.textContent)));
    
    // Reset move counter and timer
    moveCounter = 0;
    document.getElementById("moveCounter").textContent = moveCounter;
}

// Function to check if the puzzle is solvable
function checkIfSolvable(cells) {
    let inversions = 0;
    let blankRow = 0;
    
    for (let i = 0; i < cells.length; i++) {
        // Find the row of the blank space
        if (cells[i] === "x") {
            blankRow = Math.floor(i / gridSize) + 1;
        } else {
            for (let j = i + 1; j < cells.length; j++) {
                if (cells[j] !== "x" && cells[i] > cells[j]) {
                    inversions++;
                }
            }
        }
    }

    // For a 4x4 puzzle, if the grid width is odd, then the number of inversions must be even for the puzzle to be solvable.
    // If the grid width is even, the puzzle is solvable if the blank is on an even row counting from the bottom and the number of inversions is odd,
    // or if the blank is on an odd row from the bottom and the number of inversions is even.
    if (gridSize % 2 === 1) {
        // Odd grid size
        return inversions % 2 === 0;
    } else {
        // Even grid size
        console.log(blankRow, inversions);
        return (blankRow + inversions) % 2 === 0;
    }
}

// Initialize the grid
function run() {
    shuffleGrid();
    document.addEventListener("keydown", moveCellWithKeyboard);
    document.addEventListener("DOMContentLoaded", moveCellWithMouse);
    document.getElementById("shuffleButton").addEventListener("click", shuffleGrid);
    document.getElementById("resetButton").addEventListener("click", resetGame);
}

run();