const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Player properties
const player = {
    x: canvas.width / 2,
    y: canvas.height - 75,
    width: 50,
    height: 50,
    color: '#ffff00',
    speed: 5
};

// Arrays for falling objects
let circles = [];
let squares = [];
let score = 0;

// Initialize falling objects
function createObjects() {
    // Create 5 circles (hazards)
    for(let i = 0; i < 5; i++) {
        circles.push({
            x: Math.random() * canvas.width,
            y: -50,
            radius: 20,
            vy: Math.random() * 3 + 2
        });
    }

    // Create 5 squares (items)
    for(let i = 0; i < 5; i++) {
        squares.push({
            x: Math.random() * canvas.width,
            y: -50,
            size: 40,
            vy: Math.random() * 3 + 2
        });
    }
}

// Reset object position
function resetObject(obj, isCircle) {
    obj.x = Math.random() * canvas.width;
    obj.y = -50;
    obj.vy = Math.random() * 3 + 2;
}

// Game controls
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (e) => {
    if(e.key === 'a') leftPressed = true;
    if(e.key === 'd') rightPressed = true;
});

document.addEventListener('keyup', (e) => {
    if(e.key === 'a') leftPressed = false;
    if(e.key === 'd') rightPressed = false;
});

// Check collisions
function checkCollision(obj, isCircle) {
    const playerCenterX = player.x + player.width/2;
    const playerCenterY = player.y + player.height/2;
    
    if(isCircle) {
        const distance = Math.sqrt(
            Math.pow(obj.x - playerCenterX, 2) + 
            Math.pow(obj.y - playerCenterY, 2)
        );
        return distance < (obj.radius + player.width/2);
    } else {
        return obj.x < player.x + player.width &&
               obj.x + obj.size > player.x &&
               obj.y < player.y + player.height &&
               obj.y + obj.size > player.y;
    }
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player
    if(leftPressed && player.x > 0) player.x -= player.speed;
    if(rightPressed && player.x < canvas.width - player.width) player.x += player.speed;

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Update and draw circles
    circles.forEach(circle => {
        circle.y += circle.vy;
        if(circle.y > canvas.height) resetObject(circle, true);

        if(checkCollision(circle, true)) {
            player.color = 'red';
            score = 0;
            scoreDisplay.textContent = 'Score: ' + score;
            setTimeout(() => player.color = '#ffff00', 500);
            circles.forEach(c => resetObject(c, true));
            squares.forEach(s => resetObject(s, false));
        }

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    });

    // Update and draw squares
    squares.forEach(square => {
        square.y += square.vy;
        if(square.y > canvas.height) resetObject(square, false);

        if(checkCollision(square, false)) {
            player.color = 'green';
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
            setTimeout(() => player.color = '#ffff00', 500);
            resetObject(square, false);
        }

        ctx.fillStyle = 'blue';
        ctx.fillRect(square.x, square.y, square.size, square.size);
    });

    requestAnimationFrame(gameLoop);
}

// Start game
createObjects();
gameLoop();