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

//cell variables
const CELL_HEIGHT = canvasHeight / CELL_ROW_COUNT;
const CELL_WIDTH = canvasWidth / CELL_COLUMN_COUNT;
const CELL_COLOUR = "#0095DD";
let cells = [];
for (let c = 0; c < CELL_COLUMN_COUNT; c++) {
    cells[c] = [];
    for (let r = 0; r < CELL_ROW_COUNT; r++) {
        let cellX = (c * CELL_WIDTH);
        let cellY = (r * CELL_HEIGHT);
        cells[c][r] = {
            x: cellX,
            y: cellY,
            alive: false,
            aliveNext: false,
        }

    }
}

//game variables
let playing = false;
let iterateGeneration = false;
const GENERATION_TIME = 200;

/* ---------------------------- event listeners --------------------------- */

canvas.addEventListener('mousedown', mouseDownHandler);
document.querySelector('.start').addEventListener('click', startButtonHandler);
document.querySelector('.next').addEventListener('click', nextButtonHandler);

/* ------------------------------- Handlers ------------------------------- */

function mouseDownHandler(e) {
    //find which cell has been selected within the grid
    var canvasArea = canvas.getBoundingClientRect();
    let gridXSelect = Math.floor(((e.clientX - canvasArea.left) / canvasWidth) * CELL_COLUMN_COUNT);
    let gridYSelect = Math.floor(((e.clientY - canvasArea.top) / canvasHeight) * CELL_ROW_COUNT);

    //toggle its alive attribute and redraw
    cells[gridXSelect][gridYSelect].alive = !cells[gridXSelect][gridYSelect].alive;
    cells[gridXSelect][gridYSelect].aliveNext = false;
    ctx.beginPath();
    ctx.rect(cells[gridXSelect][gridYSelect].x + GRID_STROKE_WIDTH, cells[gridXSelect][gridYSelect].y + GRID_STROKE_WIDTH, CELL_WIDTH - 2 * GRID_STROKE_WIDTH, CELL_HEIGHT - 2 * GRID_STROKE_WIDTH);
    if (cells[gridXSelect][gridYSelect].alive === true)
        ctx.fillStyle = CELL_COLOUR;
    else
        ctx.fillStyle = BACKGROUND_COLOUR;
    ctx.fill();
    ctx.closePath();
}

function startButtonHandler(e) {
    playing = !playing;
    console.log(playing);
}

function nextButtonHandler(e){
    iterateGeneration = true;
}

/* ----------------------------- Draw Functions ----------------------------- */

function drawCells() {
    for (let c = 0; c < CELL_COLUMN_COUNT; c++) {
        for (let r = 0; r < CELL_ROW_COUNT; r++) {
            if (cells[c][r].aliveNext == true) {
                ctx.beginPath();
                ctx.rect(cells[c][r].x, cells[c][r].y, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillStyle = CELL_COLOUR;
                ctx.fill();
                ctx.closePath();
                alive: true;
                aliveNext: false;
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
}

/* --------------------------------- Testing -------------------------------- */


/* -------------------------------- game functions ------------------------------- */
function nextGeneration() {
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

            //determine if cell will live to next generation
            if (neighbourCount < 2)
                cells[c][r].aliveNext = false;
            else if (neighbourCount == 2 && cells[c][r].alive == true)
                cells[c][r].aliveNext = true;
            else if(neighbourCount == 3)
                cells[c][r].aliveNext = true;
            else if(neighbourCount > 3)
                cells[c][r].aliveNext = false;
        }
    }
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