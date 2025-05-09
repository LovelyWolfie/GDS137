class Player {
    constructor() {
        this.x = 100;
        this.y = 100;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        this.jumpForce = -15;
        this.gravity = 0.8;
        this.velocityY = 0;
        this.isJumping = false;
        this.doubleJumpAvailable = true;
        this.health = 100;
        this.powerUpActive = false;
        this.powerUpTimer = 0;
    }

    // Movement mechanics
    move(direction) {
        switch(direction) {
            case 'left':
                this.x -= this.speed;
                break;
            case 'right':
                this.x += this.speed;
                break;
        }
    }

    // Jump mechanics
    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        } else if (this.doubleJumpAvailable) {
            this.velocityY = this.jumpForce;
            this.doubleJumpAvailable = false;
        }
    }

    // Apply gravity
    applyGravity() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Ground check (assuming ground is at y = 500)
        if (this.y > 500) {
            this.y = 500;
            this.velocityY = 0;
            this.isJumping = false;
            this.doubleJumpAvailable = true;
        }
    }

    // Power-up system
    activatePowerUp(type) {
        this.powerUpActive = true;
        this.powerUpTimer = 300; // 5 seconds at 60fps

        switch(type) {
            case 'speed':
                this.speed *= 2;
                break;
            case 'jump':
                this.jumpForce *= 1.5;
                break;
            case 'health':
                this.health = Math.min(this.health + 50, 100);
                break;
        }
    }

    // Update power-up status
    updatePowerUp() {
        if (this.powerUpActive) {
            this.powerUpTimer--;
            if (this.powerUpTimer <= 0) {
                this.deactivatePowerUp();
            }
        }
    }

    // Deactivate power-up
    deactivatePowerUp() {
        this.powerUpActive = false;
        this.speed = 5;
        this.jumpForce = -15;
    }

    // Damage system
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    // Death function
    die() {
        console.log("Game Over");
        // Add your game over logic here
    }

    // Update function
    update() {
        this.applyGravity();
        this.updatePowerUp();
    }
}

// Start the game
gameLoop();

// Example of using power-ups
function collectPowerUp(type) {
    player.activatePowerUp(type);
}

// Example collision detection
function checkCollision(object1, object2) {
    return object1.x < object2.x + object2.width &&
           object1.x + object1.width > object2.x &&
           object1.y < object2.y + object2.height &&
           object1.y + object1.height > object2.y;
}
