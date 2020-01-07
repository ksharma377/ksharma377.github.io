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
            state.current = state.playing;
            break;
        
        case state.playing:
            bird.flap();
            break;

        case state.gameOver:
            state.current = state.getReady;
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
    dx: 2,

    draw: function() {
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX, this.destinationY, this.width, this.height);
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX + this.width, this.destinationY, this.width, this.height);
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX + 2 * this.width, this.destinationY, this.width, this.height);
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX + 3 * this.width, this.destinationY, this.width, this.height);
    },

    update: function() {

        if (state.current == state.playing) {

            // KEEP MOVING THE GROUND TO THE LEFT UNTIL...
            this.destinationX -= this.dx;

            // THE THRESHOLD IS REACHED, HERE 1/4 OF ITS WIDTH
            if (this.destinationX <= -this.width / 4) {
                this.destinationX = 0;
            }
        }
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
            sourceY: 139,
        },
        {
            sourceX: 276,
            sourceY: 164,
        },
        {
            sourceX: 276,
            sourceY: 139,
        }
    ],
    width: 34,
    height: 26,
    destinationX: 100,
    destinationY: 150,
    frame: 0,
    period: 5,
    speed: 0,
    gravity: 0.25,
    jump: 4,

    draw: function() {
        let birdInstance = this.birdType[this.frame];
        context.drawImage(imagePack, birdInstance.sourceX, birdInstance.sourceY, this.width, this.height,
            this.destinationX - this.width / 2, this.destinationY - this.height / 2, this.width, this.height);
    },

    flap: function() {

        // SET THE SPEED TO AN UPWARD VALUE
        this.speed = -this.jump;
    },

    update: function() {

        // BIRD FLAPS FASTER WHEN IN PLAYING STATE
        this.period = (state.current == state.getReady) ? 10 : 5;

        // UPDATE THE BIRD INSTANCE EVERY "PERIOD" FRAMES
        this.frame += (frames % this.period == 0) ? 1 : 0;
        this.frame = this.frame % 4;

        if (state.current == state.getReady) {

            // RESET THE VERTICAL POSITION OF THE BIRD
            this.destinationY = 150;

        } else {

            this.speed += this.gravity;
            this.destinationY += this.speed;
            
            // CHECK IF THE BIRD HAS HIT THE GROUND
            if (this.destinationY + this.height / 2 >= canvas.height - ground.height) {

                // SET GAME STATE TO GAME OVER
                state.current = state.gameOver;

                // FIX THE BIRD ON THE GROUND
                this.destinationY = canvas.height - ground.height - this.height / 2 + 1;
                
                // STOP VERTICAL MOTION
                this.speed = 0;

                // STOP ANIMATION
                this.frame = 1;
            }
        }
    }
}

// PIPES
const pipes = {
    
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

// UPDATE THE OBJECTS
function update() {
    bird.update();
    ground.update();
}

// PAINT ONE FRAME AT A TIME
function draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
    ground.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
}

function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();
