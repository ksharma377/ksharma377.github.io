const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Load images
const foodImage = new Image();
foodImage.src = "images/food.png";

// Load sounds
const Sound = {
	EAT: new Audio("sounds/sfx_eat.mp3"),
	DIE: new Audio("sounds/sfx_die.mp3")
}

// Box
const Box = Object.freeze({
	size: 20,
	padding: 1
});

// Game states
const State = Object.freeze({
	GET_READY: 1,
	PLAYING: 2,
	GAME_OVER: 3
});

// To track the current game state
let currentState;

// Directions
const Direction = Object.freeze({
	UP: 1,
	RIGHT: 2,
	DOWN: 3,
	LEFT: 4
});

// Scoreboard
const Scoreboard = {

	x: 0,
	y: 0,
	width: canvas.width,
	height: 50,
	score: 0,

	draw: function() {

		// Background color
		context.fillStyle = "#003300";//"#663300";
		context.fillRect(this.x, this.y, this.width, this.height);

		// Food
		context.drawImage(foodImage, this.height / 2 - Food.height / 2, this.height / 2 - Food.height / 2);

		// Score
		context.lineWidth = 2;
		context.font = "35px Teko";
		context.fillStyle = "white";
		context.fillText(this.score, this.height, this.height / 2 + Food.height / 2);
		context.strokeText(this.score, this.height, this.height / 2 + Food.height / 2);
	},

	reset: function() {

		// Reset score at the beginning of a new game
		this.score = 0;
	}
}

// Play area
const PlayArea = Object.freeze({

	x: 0,
	y: Scoreboard.height,
	width: canvas.width,
	height: canvas.height - Scoreboard.height,
	get horizontalRange() { return this.width / Box.size },
	get verticalRange() { return this.height / Box.size },

	draw: function() {
		context.fillStyle = "#009933";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
});

// Snake
const Snake = {

	pieceSize: Box.size - 2 * Box.padding,
	direction: Direction.RIGHT,
	body: [],

	draw: function() {
		for (let i = 0; i < this.body.length; i++) {
			let x = Util.getXCoordinate(this.body[i].x);
			let y = Util.getYCoordinate(this.body[i].y);
			context.fillStyle = (i == 0 ? "#331a00" : "#663300");
			context.fillRect(x - this.pieceSize / 2, y - this.pieceSize / 2, this.pieceSize, this.pieceSize);
		}
	},

	update: function() {

		// Only animate the snake in playing state
		if (currentState != State.PLAYING) {
			return;
		}

		let oldHead = this.body[0];
		let newHead = {
			x: oldHead.x,
			y: oldHead.y
		};

		switch (this.direction) {

			case Direction.RIGHT:
				newHead.x++;
				break;
			
			case Direction.LEFT:
				newHead.x--;
				break;

			case Direction.UP:
				newHead.y--;
				break;
					
			case Direction.DOWN:
				newHead.y++;
				break;
		}

		// Add a new head
		this.body.unshift(newHead);

		// Check collision
		if (Util.collisionOccured()) {
			gameOver();
		}

		if (Util.foodEaten()) {

			// Play score sound
			Sound.EAT.currentTime = 0;  // To play instantly, irrespective of previous sound finish
			Sound.EAT.play();
			
			// Place food in a new spot
			Food.reset();

			// Increment the score
			Scoreboard.score++;

		} else {

			// Remove the tail only if the snake didn't eat the food
			this.body.pop();
		}
		
	},

	reset: function() {

		// Reset direction to the right
		this.direction = Direction.RIGHT;

		// Clear the body
		this.body.splice(0, this.body.length);

		// Push a new head
		this.body.push({
			x: PlayArea.horizontalRange / 2,
			y: PlayArea.verticalRange / 2
		});
	}
}

// Food
const Food = {

	x: 0,
	y: 0,
	height: Box.size,
	width: Box.size,

	draw: function() {

		let x = Util.getXCoordinate(this.x);
		let y = Util.getYCoordinate(this.y);
		context.drawImage(foodImage, x - this.width / 2, y - this.height / 2);
	},

	reset: function() {

		// Reset food to random location
		this.x = Math.floor(Math.random() * PlayArea.horizontalRange);
		this.y = Math.floor(Math.random() * PlayArea.verticalRange);
	}
}

// Add click listener to the canvas
canvas.addEventListener("click", function(event) {

	switch (currentState) {

		case State.GET_READY:
			startGame();
			break;

		case State.GAME_OVER:
			reset();
			currentState = State.GET_READY;
			break;
	}

});

// Add key listener to the window
window.addEventListener("keydown", function(event) {

	let key = event.keyCode;

	switch (currentState) {

		case State.GET_READY:
			// Check for Enter or Spacebar keys
			if (key == 13 || key == 32) {
				startGame();
			}
			break;

		case State.PLAYING:
			// Check for arrow keys or W, A, S, D
			if ((key == 37 || key == 65) && Snake.direction != Direction.RIGHT) {
				Snake.direction = Direction.LEFT;
			} else if ((key == 38 || key == 87) && Snake.direction != Direction.DOWN) {
				Snake.direction = Direction.UP;
			} else if ((key == 39 || key == 68) && Snake.direction != Direction.LEFT) {
				Snake.direction = Direction.RIGHT;
			} else if ((key == 40 || key == 83) && Snake.direction != Direction.UP) {
				Snake.direction = Direction.DOWN;
			}
			break;
		
		case State.GAME_OVER:
			// Check for Enter or Spacebar keys
			if (key == 13 || key == 32) {
				reset();
				currentState = State.GET_READY;
			}
			break;
	}

});

// Start the game
function startGame() {
	currentState = State.PLAYING;
}

// Game over
function gameOver() {

	// Play die sound
	Sound.DIE.currentTime = 0;  // To play instantly, irrespective of previous sound finish
	Sound.DIE.play();

	// Change game state
	currentState = State.GAME_OVER;
}

// Update the objects
function update() {
	Snake.update();
}

// Draw the objects
function draw() {
	PlayArea.draw();
	Snake.draw();
	Food.draw();
	Scoreboard.draw();
}

// Reset the objects and the game state
function reset() {
	currentState = State.GET_READY;
	Snake.reset();
	Food.reset();
	Scoreboard.reset();
}

// Keep refreshing every frame
function loop() {
	update();
	draw();
}

// Reset objects initially
reset();

// Refresh every 100 ms
setInterval(loop, 100);

// Utility functions
const Util = {

	// Convert box X coordinate to canvas pixels (centered at the box)
	getXCoordinate: function(x) {
		return x * Box.size + Box.size / 2;
	},

	// Convert box Y coordinate to canvas pixels (centered at the box)
	getYCoordinate: function(y) {
		return y * Box.size + Box.size / 2 + Scoreboard.height;
	},

	// To check if the snake ate the food
	foodEaten: function() {
		return (Snake.body[0].x == Food.x && Snake.body[0].y == Food.y);
	},

	// To check if the snake collided with itself or the walls
	collisionOccured: function() {

		const snakeHead = Snake.body[0];

		// Check collision with vertical borders
		if (snakeHead.x < 0 || snakeHead.x >= PlayArea.horizontalRange) {
			return true;
		}

		// Check collision with horizontal borders
		if (snakeHead.y < 0 || snakeHead.y >= PlayArea.verticalRange) {
			return true;
		}

		// Check collision of snake with itself
		for (let i = 1; i < Snake.body.length; i++) {
			if (snakeHead.x == Snake.body[i].x &&
					snakeHead.y == Snake.body[i].y) {
				return true;
			}
		}
		return false;
	}
}
