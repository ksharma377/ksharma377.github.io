const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let frames = 0;
const imagePack = new Image();
imagePack.src = "images/imagePack.png";

const background = {
    sourceX: 0,
    sourceY: 0,
    destinationX: 0,
    destinationY: canvas.height - 226,
    width: 275,
    height: 226,

    draw: function() {
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX, this.destinationY, this.width, this.height);
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX + this.width, this.destinationY, this.width, this.height);
        context.drawImage(imagePack, this.sourceX, this.sourceY, this.width, this.height,
            this.destinationX + 2 * this.width, this.destinationY, this.width, this.height);
    }
}

const ground = {
    sourceX: 276,
    sourceY: 0,
    destinationX: 0,
    destinationY: canvas.height - 100,
    width: 224,
    height: 100,

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

function draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
    ground.draw();
}

function loop() {
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();
