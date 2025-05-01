<<<<<<< HEAD:Smalls_Paddle ball/js/gameobjects.js
body {
  display: flex;
  justify-content: center;
}

.ball {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color:rgb(34, 255, 170);
  animation: bounce 0.5s;
  animation-direction: alternate;
  animation-timing-function: cubic-bezier(.5, 0.05, 1, .5);
  animation-iteration-count: infinite;
}
=======
var canvas = document.getElementById("gameFrame");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 20;
var paddleWidth = 80;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
  console.log(e.key);
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 1, Math.PI * 2);
  ctx.fillStyle = "#45ED9C";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 20, paddleWidth, paddleHeight);
  ctx.fillStyle = "#4599ED";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (x > paddleX && x < paddleX + paddleWidth && (y + dy > canvas.height - paddleHeight - 20)) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    $("#gameover").text("Game yay!! The nightmare is done!");
    document.location.reload();

  } else {

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    x += dx;
    y += dy;
    console.log(rightPressed, leftPressed)
  }
  x += dx;
  y += dy;
  drawBall();
  drawPaddle();
  
}

setInterval(draw, 1000/60);
>>>>>>> 62ec0bc604631288f5ce365b8179e1694edfde71:Paddle_ball/js/gameobjects.js
