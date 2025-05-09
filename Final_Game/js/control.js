// Game controls
const keys = {
    left: false,
    right: false,
    up: false
};

// Event listeners for controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'ArrowRight':
            keys.right = true;
            break;
        case 'ArrowUp':
        case ' ':
            keys.up = true;
            player.jump();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'ArrowUp':
        case ' ':
            keys.up = false;
            break;
    }
});

// Game loop
const player = new Player();

function gameLoop() {
    // Handle movement based on key states
    if (keys.left) player.move('left');
    if (keys.right) player.move('right');

    // Update player state
    player.update();

    // Request next frame
    requestAnimationFrame(gameLoop);
}
