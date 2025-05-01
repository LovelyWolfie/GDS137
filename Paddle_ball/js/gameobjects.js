var canvas = document.getElementById("gameFrame");
var ctx = canvas.getContext("2d");
var ballRadius = 20;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = 2;
var paddleHeight = 20;
var paddleWidth = 80;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
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
  ctx.rect(paddleX, canvas.height - paddleHeight - 30, paddleWidth, paddleHeight);
  ctx.fillStyle = "#4599ED";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(5, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();

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
  }}

  setInterval(draw, 20);