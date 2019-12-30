canvas = document.getElementById("canvas");
context = canvas.getContext("2d");
var bird = new Image();
var background = new Image();
var ground = new Image();
var upperPipe = new Image();
var lowerPipe = new Image();

bird.src = "images/bird.png"
background.src = "images/background.png";
ground.src = "images/ground.png";
upperPipe.src = "images/upperPipe.png";
lowerPipe.src = "images/lowerPipe.png";

function draw() {
    background.onload = function() {
        context.drawImage(background, 0, 0);
    }
    upperPipe.onload = function() {
        context.drawImage(upperPipe, 300, -50);
    }
    lowerPipe.onload = function() {
        context.drawImage(lowerPipe, 300, 300);
    }
    ground.onload = function() {
        context.drawImage(ground, 0, 360);
    }
    bird.onload = function() {
        context.drawImage(bird, 100, 200);
    }
}

draw();
