const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let frames = 0;

// Load the image pack
const imagePack = new Image();
imagePack.src = "images/imagePack.png";

// Game state
let state = {
    current: 1,
    getReady: 1,
    playing: 2,
    gameOver: 3
}

// Add listener to the canvas
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

// Background object
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

// Ground object
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

            // Keep moving the ground left until...
            this.destinationX -= this.dx;

            // The threshold is reached, here 1/4th of its width
            if (this.destinationX <= -this.width / 4) {
                this.destinationX = 0;
            }
        }
    }
}

// Bird object
const bird = {

    // Different images for the animation
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

        // Set the speed to an upward value
        this.speed = -this.jump;
    },

    update: function() {

        // Bird flaps faster when in playing state
        this.period = (state.current == state.getReady) ? 10 : 5;

        // Update the bird instance every "period" frames
        this.frame += (frames % this.period == 0) ? 1 : 0;
        this.frame = this.frame % this.birdType.length;

        if (state.current == state.getReady) {

            // Reset the vertical position of the bird
            this.destinationY = 150;

        } else {

            // Increase the downward speed due to gravity
            this.speed += this.gravity;
            this.destinationY += this.speed;
            
            // Check if the bird has hit the ground
            if (this.destinationY + this.height / 2 >= canvas.height - ground.height) {

                // Set the game state to "game over"
                state.current = state.gameOver;

                // Fix the bird to the ground
                this.destinationY = canvas.height - ground.height - this.height / 2 + 1;
                
                // Freeze the bird's vertical motion
                this.speed = 0;

                // Stop the bird's animation
                this.frame = 1;
            }
        }
    }
}

// Pipes object
const pipes = {
    // top: {
    //     sourceX:
    //     sourceY:
    // },
    // bottom: {
    //     sourceX:
    //     sourceY:
    // },
    // width:
    // height:
    // destinationX: canvas.width,

}

// Get ready message
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

// Game over message
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

// Update the objects
function update() {
    bird.update();
    ground.update();
}

// Draw the objects
function draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
    ground.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
}

// Keep refreshing every frame
function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();
