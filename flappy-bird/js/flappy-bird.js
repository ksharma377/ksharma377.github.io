const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let frames = 0;

// LOAD THE IMAGE PACK
const imagePack = new Image();
imagePack.src = "images/imagePack.png";

// GAME STATE
let state = {
    current: 1,
    getReady: 1,
    playing: 2,
    gameOver: 3
}

// ADD LISTENER TO THE CANVAS
canvas.addEventListener("click", function(event) {
    switch (state.current) {
        case state.getReady:
            state.current = state.getReady;
            break;
        
        case state.playing:
            break;

        case state.gameOver:
            break;
    }
});

// BACKGROUND
const background = {
    sourceX: 0,
    sourceY: 0,
    width: 275,
    height: 226,
    destinationX: 0,
    destinationY: canvas.height - 226,

    draw: function() {
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX, this.destinationY, this.width, this.height);
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX + this.width, this.destinationY, this.width, this.height);
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX + 2 * this.width, this.destinationY, this.width, this.height);
    }
}

// GROUND
const ground = {
    sourceX: 276,
    sourceY: 0,
    width: 224,
    height: 100,
    destinationX: 0,
    destinationY: canvas.height - 100,

    draw: function() {
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX, this.destinationY, this.width, this.height);
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX + this.width, this.destinationY, this.width, this.height);
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX + 2 * this.width, this.destinationY, this.width, this.height);
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX + 3 * this.width, this.destinationY, this.width, this.height);
    }
}

// BIRD
const bird = {
    birdType: [
        {
            sourceX: 276,
            sourceY: 112,
        },
        {
            sourceX: 276,
            sourceY: 138,
        },
        {
            sourceX: 276,
            sourceY: 164,
        },
        {
            sourceX: 276,
            sourceY: 138,
        }
    ],
    width: 34,
    height: 26,
    destinationX: 100,
    destinationY: 150,

    draw: function() {
        let birdInstance = this.birdType[frames % 4];
        context.drawImage(imagePack, birdInstance.sourceX, birdInstance.sourceY, this.width, this.height,
            this.destinationX, this.destinationY, this.width, this.height);
    }
}

// GET READY MESSAGE
const getReady = {
    sourceX: 0,
    sourceY: 228,
    width: 174,
    height: 152,
    destinationX: canvas.width / 2 - 174 / 2,
    destinationY: 80,

    draw: function() {
        if (state.current == state.getReady) {
            context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
                this.destinationX, this.destinationY, this.width, this.height);
        }
    }
}

// GAME OVER MESSAGE
const gameOver = {
    sourceX: 174,
    sourceY: 228,
    width: 226,
    height: 202,
    destinationX: canvas.width / 2 - 226 / 2,
    destinationY: 90,

    draw: function() {
        if (state.current == state.gameOver) {
            context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
                this.destinationX, this.destinationY, this.width, this.height);
        }
    }
}

// PAINT ONE FRAME AT A TIME
function draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
    ground.draw();
    bird.draw();
    getReady.draw();
}

function loop() {
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();
