/* -------------------------------- Variables ------------------------------- */

//canvas variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

//grid variables
const CELL_COLUMN_COUNT = 20;
const CELL_ROW_COUNT = 20;
const GRID_STROKE_WIDTH = 1;
const GRID_COLOUR = "#0095DD";
const BACKGROUND_COLOUR = "white";
const NEXT_ALIVE_COLOUR = "yellow";
const NEXT_DEAD_COLOUR = "grey";

//cell variables
const CELL_HEIGHT = canvasHeight / CELL_ROW_COUNT;
const CELL_WIDTH = canvasWidth / CELL_COLUMN_COUNT;
const CELL_COLOUR = "#0095DD";
const NEIGHBOUR_COUNT_COLOUR = "black";
let cells = [];
for (let c = 0; c < CELL_COLUMN_COUNT; c++) {
    cells[c] = [];
    for (let r = 0; r < CELL_ROW_COUNT; r++) {
        let cellX = (c * CELL_WIDTH);
        let cellY = (r * CELL_HEIGHT);
        cells[c][r] = {
            x: cellX,
            y: cellY,
            neighbours: 0,
            alive: false,
            aliveNext: false,
        }

    }
}

//game variables
let playing = false;
let iterateGeneration = false;
let displayAliveDeadNext = false;
let displayNeighbours = false;
const GENERATION_TIME = 200;

/* ---------------------------- event listeners --------------------------- */

canvas.addEventListener('mousedown', mouseDownHandler);
document.querySelector('.start').addEventListener('click', startButtonHandler);
document.querySelector('.next').addEventListener('click', nextButtonHandler);
document.querySelector('.rst').addEventListener('click', resetButtonHandler);
document.querySelector('.neighbours').addEventListener('click', neighbourButtonHandler);

/* ------------------------------- Handlers ------------------------------- */

function mouseDownHandler(e) {
    //find which cell has been selected within the grid
    var canvasArea = canvas.getBoundingClientRect();
    let gridXSelect = Math.floor(((e.clientX - canvasArea.left) / canvasWidth) * CELL_COLUMN_COUNT);
    let gridYSelect = Math.floor(((e.clientY - canvasArea.top) / canvasHeight) * CELL_ROW_COUNT);

    //toggle its alive attribute and redraw
    cells[gridXSelect][gridYSelect].alive = !cells[gridXSelect][gridYSelect].alive;
    cells[gridXSelect][gridYSelect].aliveNext = false;
    calculateNeighbourCount();
    draw();
}

function startButtonHandler(e) {
    playing = !playing;
    if (playing)
        document.querySelector('.start').innerHTML = "Stop";
    else
        document.querySelector('.start').innerHTML = "Start";
}

function nextButtonHandler(e) {
    iterateGeneration = true;
}

function resetButtonHandler(e) {
    for (let c = 0; c < CELL_COLUMN_COUNT; c++) {
        for (let r = 0; r < CELL_ROW_COUNT; r++) {
            cells[c][r].alive = false;
            cells[c][r].aliveNext = false;
            cells[c][r].neighbours = 0;
        }
    }
    draw();
}

function neighbourButtonHandler(e) {
    displayNeighbours = !displayNeighbours;
    draw();
}

/* ----------------------------- Draw Functions ----------------------------- */

function drawCells() {
    for (let c = 0; c < CELL_COLUMN_COUNT; c++) {
        for (let r = 0; r < CELL_ROW_COUNT; r++) {
            if (displayAliveDeadNext) {

            } else {
                if (cells[c][r].alive == true) {
                    ctx.beginPath();
                    ctx.rect(cells[c][r].x, cells[c][r].y, CELL_WIDTH, CELL_HEIGHT);
                    ctx.fillStyle = CELL_COLOUR;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
}

function drawGrid() {
    //draw gridlines
    for (let c = 1; c < CELL_COLUMN_COUNT; c++) {
        ctx.moveTo(c * CELL_WIDTH, 0);
        ctx.lineTo(c * CELL_WIDTH, canvasHeight);
    }
    for (let r = 1; r < CELL_ROW_COUNT; r++) {
        ctx.moveTo(0, r * CELL_HEIGHT);
        ctx.lineTo(canvasWidth, r * CELL_HEIGHT);
    }
    ctx.lineWidth = GRID_STROKE_WIDTH;
    ctx.strokeStyle = GRID_COLOUR;
    ctx.stroke();

    //draw border
    ctx.strokeRect(0, 0, canvasHeight, canvasWidth);
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawCells();
    drawGrid();
    if (displayNeighbours)
        displayNeighbourCount(); //purely for testing
}

/* --------------------------------- Testing -------------------------------- */
function displayNeighbourCount() {
    ctx.font = "20px Arial";
    ctx.fillStyle = NEIGHBOUR_COUNT_COLOUR;

    for (let c = 0; c < CELL_COLUMN_COUNT; c++) {
        for (let r = 0; r < CELL_ROW_COUNT; r++) {
            ctx.fillText(cells[c][r].neighbours, c * CELL_WIDTH, r * CELL_HEIGHT + CELL_HEIGHT);
        }
    }
}

/* -------------------------------- game functions ------------------------------- */
function calculateNeighbourCount() {
    for (let c = 0; c < CELL_COLUMN_COUNT; c++) {
        for (let r = 0; r < CELL_ROW_COUNT; r++) {
            let neighbourCount = 0;
            //check surrounding and count alive cells
            for (let XOffset = -1; XOffset < 2; XOffset++) {
                for (let YOffset = -1; YOffset < 2; YOffset++) {
                    //check only 8 surrounding cells
                    if (!(XOffset == 0 && YOffset == 0)) {
                        //make sure checked cell is within grid bounds
                        if (c + XOffset >= 0 && c + XOffset < CELL_COLUMN_COUNT && r + YOffset >= 0 && r + YOffset < CELL_ROW_COUNT) {
                            if (cells[c + XOffset][r + YOffset].alive == true)
                                neighbourCount++
                        }
                    }
                }
            }
            cells[c][r].neighbours = neighbourCount;
        }
    }
}

function nextGeneration() {
    for (let c = 0; c < CELL_COLUMN_COUNT; c++) {
        for (let r = 0; r < CELL_ROW_COUNT; r++) {
            //determine if cell will live to next generation
            if (cells[c][r].neighbours < 2)
                cells[c][r].aliveNext = false;
            else if (cells[c][r].neighbours == 2 && cells[c][r].alive == true)
                cells[c][r].aliveNext = true;
            else if (cells[c][r].neighbours == 3)
                cells[c][r].aliveNext = true;
            else if (cells[c][r].neighbours > 3)
                cells[c][r].aliveNext = false;
        }
    }
    for (let c = 0; c < CELL_COLUMN_COUNT; c++) {
        for (let r = 0; r < CELL_ROW_COUNT; r++) {
            cells[c][r].alive = cells[c][r].aliveNext
            cells[c][r].aliveNext = false;
        }
    }
    calculateNeighbourCount();
}

function gameLoop() {
    if (playing || iterateGeneration) {
        nextGeneration();
        draw();
        console.log("next generation");
        iterateGeneration = false;
    }
}

function startGame() {
    draw();
    gameLoop();
}

startGame();

setInterval(gameLoop, GENERATION_TIME);