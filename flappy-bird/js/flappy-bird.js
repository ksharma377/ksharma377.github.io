const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let frames = 0;

// Load the image pack
const imagePack = new Image();
imagePack.src = "images/imagePack.png";

// Load the sound effects
const scoreSound = new Audio("sounds/sfx_score.mp3");
const dieSound = new Audio("sounds/sfx_die.mp3");
const flapSound = new Audio("sounds/sfx_flap.mp3");
const hitSound = new Audio("sounds/sfx_hit.mp3");
const swooshSound = new Audio("sounds/sfx_swoosh.mp3");

// Game state
const state = {
    current: 1,
    getReady: 1,
    playing: 2,
    gameOver: 3
}

// Start the game
function startGame() {
    swooshSound.currentTime = 0;  // To play instantly, irrespective of previous sound finish
    swooshSound.play();
    state.current = state.playing;
}

// Flap the bird
function flapBird() {
    flapSound.currentTime = 0;  // To play instantly, irrespective of previous sound finish
    flapSound.play();
    bird.flap();
}

// Add click listener to the canvas
canvas.addEventListener("click", function(event) {

    switch (state.current) {

        case state.getReady:
            startGame();
            break;
        
        case state.playing:
            flapBird();
            break;

        case state.gameOver:
            let canvasCoordinates = canvas.getBoundingClientRect();
            let clickX = event.clientX - canvasCoordinates.left;
            let clickY = event.clientY - canvasCoordinates.top;

            // Check if the "start" button is clicked
            if (clickX >= startButton.x && clickX <= startButton.x + startButton.width &&
                clickY >= startButton.y && clickY <= startButton.y + startButton.height) {

                bird.reset();
                pipes.reset();
                score.reset();
                state.current = state.getReady;
            }
            
            break;
    }
});

// Add key listener to the window
window.addEventListener("keydown", function(event) {

    // Check if the key pressed is "space bar"
    if (event.keyCode == 32) {

        switch (state.current) {

            case state.getReady:
                startGame();
                break;
            
            case state.playing:
                flapBird();
                break;
        }
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
    radius: 13,
    destinationX: 100,
    destinationY: 150,
    frame: 0,
    period: 5,
    speed: 0,
    gravity: 0.25,
    jump: 4,

    draw: function() {

        const birdInstance = this.birdType[this.frame];

        // Center the bird while drawing. This would be useful for its rotation.
        context.drawImage(imagePack, birdInstance.sourceX, birdInstance.sourceY, this.width, this.height,
            this.destinationX - this.width / 2, this.destinationY - this.height / 2, this.width, this.height);
    },

    flap: function() {

        // Set the speed to an upward value
        this.speed = -this.jump;
    },

    update: function() {

        // The bird flaps only if it's not game over state
        if (state.current !== state.gameOver) {

            // Bird flaps faster when in playing state than in get ready state
            this.period = (state.current == state.getReady) ? 10 : 5;

            // Update the bird instance every "period" frames
            this.frame += (frames % this.period == 0) ? 1 : 0;
            this.frame = this.frame % this.birdType.length;
        }

        if (state.current == state.getReady) {

            // Reset the vertical position of the bird
            this.destinationY = 150;

        } else {

            // Increase the downward speed due to gravity
            this.speed += this.gravity;
            this.destinationY += this.speed;
            
            // Check if the bird has hit the ground
            if (this.destinationY + this.height / 2 >= canvas.height - ground.height) {
                
                // Fix the bird to the ground
                this.destinationY = canvas.height - ground.height - this.height / 2 + 1;
                
                if (state.current == state.playing) {
                
                    // Play die sound effect
                    dieSound.currentTime = 0;  // To play instantly, irrespective of previous sound finish
                    dieSound.play();

                    // Stop the bird's animation
                    this.frame = 1;
                    
                    // Set the game state to "game over"
                    state.current = state.gameOver;
                }
            }
        }
    },

    reset: function() {

        // Freeze the bird's vertical motion
        this.speed = 0;
    }
}

// Pipes object
const pipes = {

    // Positions of all the pipes, initially empty
    positions: [],

    top: {
        sourceX: 553,
        sourceY: 0
    },
    bottom: {
        sourceX: 500,
        sourceY: 0
    },

    width: 53,
    height: 400,
    minYPosition: -340,
    maxYPosition: -190,
    gap: 90,
    separation: 100,
    dx: 2,
    
    draw: function() {

        for (let i = 0; i < this.positions.length; i++) {

            const pipe = this.positions[i];
            const topYPosition = pipe.destinationY;
            const bottomYPosition = topYPosition + this.height + this.gap;

            // Top pipe
            context.drawImage(imagePack, this.top.sourceX, this.top.sourceY, this.width, this.height,
                pipe.destinationX, topYPosition, this.width, this.height);
            
            // Bottom pipe
            context.drawImage(imagePack, this.bottom.sourceX, this.bottom.sourceY, this.width, this.height,
                pipe.destinationX, bottomYPosition, this.width, this.height);
        }
    },

    update: function() {

        // Do nothing if it's not playing state
        if (state.current !== state.playing) {
            return;
        }

        // Time to add a new pipe
        if (frames % this.separation == 0) {
            this.positions.push({
                destinationX: canvas.width,
                destinationY: this.minYPosition + Math.random() * (this.maxYPosition - this.minYPosition + 1),
                updateScore: true
            });
        }

        // Move the pipes to the left
        for (let i = 0; i < this.positions.length; i++) {

            const pipe = this.positions[i];
            pipe.destinationX -= this.dx;

            // Collision detection with top pipe
            if (bird.destinationX + bird.radius > pipe.destinationX &&
                bird.destinationX - bird.radius < pipe.destinationX + this.width &&
                bird.destinationY + bird.radius > pipe.destinationY &&
                bird.destinationY - bird.radius < pipe.destinationY + this.height) {

                hitSound.currentTime = 0;  // To play instantly, irrespective of previous sound finish
                hitSound.play();

                // Stop the bird's animation
                bird.frame = 1;

                // Set the game state to "game over"
                state.current = state.gameOver;
            }

            // Collision detection with bottom pipe
            if (bird.destinationX + bird.radius > pipe.destinationX &&
                bird.destinationX - bird.radius < pipe.destinationX + this.width &&
                bird.destinationY + bird.radius > pipe.destinationY + this.height + this.gap &&
                bird.destinationY - bird.radius < pipe.destinationY + 2 * this.height + this.gap) {

                hitSound.currentTime = 0;  // To play instantly, irrespective of previous sound finish
                hitSound.play();

                // Stop the bird's animation
                bird.frame = 1;

                // Set the game state to "game over"
                state.current = state.gameOver;
            }

            // If the pipe goes past the bird, increment the score
            if (pipe.destinationX + this.width < bird.destinationX - bird.width / 2) {

                // Update the score only if this pipe has not been used before
                if (pipe.updateScore) {

                    score.value++;
                    scoreSound.currentTime = 0;  // To play instantly, irrespective of previous sound finish
                    scoreSound.play();
                    score.best = Math.max(score.best, score.value);
                    pipe.updateScore = false;
                }
            }

            // If the pipe goes beyond the canvas, delete it
            if (pipe.destinationX + this.width <= 0) {
                this.positions.shift();
                i--;
            }
        }
    },

    reset: function() {

        // Reset the positions when a game begins
        this.positions.length = 0;
    }
}

// Score
const score = {
    best: 0,
    value: 0,

    draw: function() {

        context.fillStyle = "#ffffff";
        context.strokeStyle = "#000000";

        if (state.current == state.playing) {
            context.lineWidth = 2;
            context.font = "35px Teko";
            context.fillText(this.value, canvas.width / 2 - 16, 50);
            context.strokeText(this.value, canvas.width / 2 - 16, 50);
        } else if (state.current == state.gameOver) {
            context.font = "25px Teko";
            context.fillText(this.value, gameOver.destinationX + gameOver.width - 50, gameOver.destinationY + 95);
            context.strokeText(this.value, gameOver.destinationX + gameOver.width - 50, gameOver.destinationY + 95);
            context.fillText(this.best, gameOver.destinationX + gameOver.width - 50, gameOver.destinationY + gameOver.height - 65);
            context.strokeText(this.best, gameOver.destinationX + gameOver.width - 50, gameOver.destinationY + gameOver.height - 65);
        }
    },

    reset: function() {

        // Reset the score when a game begins
        this.value = 0;
    }
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

// Start Button
const startButton = {
    x: gameOver.destinationX + 71,
    y: gameOver.destinationY + 173,
    width: 83,
    height: 29
}

// Update the objects
function update() {
    bird.update();
    ground.update();
    pipes.update();
}

// Draw the objects
function draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
    pipes.draw();
    ground.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

// Keep refreshing every frame
function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();
