class GameObject {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 50;
        this.height = options.height || 50;
        this.color = options.color || "#FF0000";
        this.speed = options.speed || 5;
        this.active = true;
        this.tag = options.tag || "default";
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.friction = options.friction || 0.8;
        this.gravity = options.gravity || 0;
        this.bounce = options.bounce || 0.5;
        this.solid = options.solid !== undefined ? options.solid : true;
    }

    // Basic update method
    update() {
        // Apply acceleration
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // Apply gravity
        this.velocity.y += this.gravity;

        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    // Draw method
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Collision detection methods
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    intersects(other) {
        const bounds = this.getBounds();
        const otherBounds = other.getBounds();

        return !(bounds.right < otherBounds.left || 
                bounds.left > otherBounds.right || 
                bounds.bottom < otherBounds.top || 
                bounds.top > otherBounds.bottom);
    }
}

// Player class extending GameObject
class Player extends GameObject {
    constructor(options = {}) {
        super(options);
        this.health = options.health || 100;
        this.maxHealth = options.maxHealth || 100;
        this.damage = options.damage || 10;
        this.jumpForce = options.jumpForce || -15;
        this.canJump = true;
        this.isJumping = false;
        this.direction = 1; // 1 for right, -1 for left
        this.inventory = [];
        this.score = 0;
    }

    jump() {
        if (this.canJump) {
            this.velocity.y = this.jumpForce;
            this.isJumping = true;
            this.canJump = false;
        }
    }

    move(direction) {
        this.velocity.x = this.speed * direction;
        this.direction = direction;
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (this.health <= 0) {
            this.die();
        }
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    die() {
        this.active = false;
        // Add death behavior here
    }

    draw(ctx) {
        super.draw(ctx);
        
        // Draw health bar
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y - 10, (this.health / this.maxHealth) * this.width, 5);
    }
}

// Enemy class extending GameObject
class Enemy extends GameObject {
    constructor(options = {}) {
        super(options);
        this.health = options.health || 50;
        this.damage = options.damage || 5;
        this.detectionRange = options.detectionRange || 200;
        this.attackRange = options.attackRange || 50;
        this.patrolPoints = options.patrolPoints || [];
        this.currentPatrolIndex = 0;
        this.state = 'patrol'; // patrol, chase, attack
    }

    update(player) {
        super.update();

        const distToPlayer = this.getDistanceTo(player);

        // State machine
        switch(this.state) {
            case 'patrol':
                this.patrol();
                if (distToPlayer < this.detectionRange) {
                    this.state = 'chase';
                }
                break;

            case 'chase':
                this.chase(player);
                if (distToPlayer > this.detectionRange) {
                    this.state = 'patrol';
                } else if (distToPlayer < this.attackRange) {
                    this.state = 'attack';
                }
                break;

            case 'attack':
                this.attack(player);
                if (distToPlayer > this.attackRange) {
                    this.state = 'chase';
                }
                break;
        }
    }

    patrol() {
        if (this.patrolPoints.length > 0) {
            const target = this.patrolPoints[this.currentPatrolIndex];
            this.moveTowards(target.x, target.y);

            if (this.getDistanceTo(target) < 10) {
                this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
            }
        }
    }

    chase(player) {
        this.moveTowards(player.x, player.y);
    }

    attack(player) {
        // Implement attack behavior
        player.takeDamage(this.damage);
    }

    moveTowards(x, y) {
        const angle = Math.atan2(y - this.y, x - this.x);
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;
    }

    getDistanceTo(object) {
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// Collectible class extending GameObject
class Collectible extends GameObject {
    constructor(options = {}) {
        super(options);
        this.value = options.value || 1;
        this.type = options.type || 'coin';
        this.collected = false;
    }

    collect(player) {
        if (!this.collected) {
            this.collected = true;
            this.active = false;
            
            switch(this.type) {
                case 'coin':
                    player.score += this.value;
                    break;
                case 'health':
                    player.heal(this.value);
                    break;
                // Add more collectible types
            }
        }
    }

    draw(ctx) {
        if (!this.collected) {
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }
}

// Platform class extending GameObject
class Platform extends GameObject {
    constructor(options = {}) {
        super(options);
        this.moving = options.moving || false;
        this.startX = this.x;
        this.startY = this.y;
        this.moveDistance = options.moveDistance || 100;
        this.moveSpeed = options.moveSpeed || 2;
        this.moveDirection = 1;
    }

    update() {
        if (this.moving) {
            if (this.moveDirection > 0) {
                if (this.x < this.startX + this.moveDistance) {
                    this.x += this.moveSpeed;
                } else {
                    this.moveDirection = -1;
                }
            } else {
                if (this.x > this.startX) {
                    this.x -= this.moveSpeed;
                } else {
                    this.moveDirection = 1;
                }
            }
        }
    }
}

// Game Manager class
class GameManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.objects = [];
        this.player = null;
        this.gameOver = false;
    }

    addObject(object) {
        this.objects.push(object);
        if (object instanceof Player) {
            this.player = object;
        }
    }

    update() {
        if (this.gameOver) return;

        // Update all objects
        this.objects.forEach(obj => {
            if (obj.active) {
                if (obj instanceof Enemy) {
                    obj.update(this.player);
                } else {
                    obj.update();
                }
            }
        });

        // Check collisions
        this.checkCollisions();

        // Clean up inactive objects
        this.objects = this.objects.filter(obj => obj.active);
    }

    checkCollisions() {
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                const objA = this.objects[i];
                const objB = this.objects[j];

                if (objA.active && objB.active && objA.intersects(objB)) {
                    this.handleCollision(objA, objB);
                }
            }
        }
    }

    handleCollision(objA, objB) {
        // Handle different collision types
        if (objA instanceof Player && objB instanceof Collectible) {
            objB.collect(objA);
        } else if (objB instanceof Player && objA instanceof Collectible) {
            objA.collect(objB);
        }

        // Handle solid object collisions
        if (objA.solid && objB.solid) {
            // Implement collision resolution
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.objects.forEach(obj => {
            if (obj.active) {
                obj.draw(this.ctx);
            }
        });
    }
}

// Usage example:
const canvas = document.getElementById('gameCanvas');
const game = new GameManager(canvas);

// Create player
const player = new Player({
    x: 100,
    y: 100,
    color: "#00FF00"
});

// Create platform
const platform = new Platform({
    x: 0,
    y: canvas.height - 50,
    width: canvas.width,
    height: 50,
    color: "#888888"
});

// Create enemy
const enemy = new Enemy({
    x: 300,
    y: 100,
    color: "#FF0000",
    patrolPoints: [
        {x: 300, y: 100},
        {x: 500, y: 100}
    ]
});

// Create collectible
const coin = new Collectible({
    x: 200,
    y: 200,
    width: 20,
    height: 20,
    color: "#FFD700",
    type: 'coin',
    value: 10
});

// Add objects to game
game.addObject(player);
game.addObject(platform);
game.addObject(enemy);
game.addObject(coin);

// Game loop
function gameLoop() {
    game.update();
    game.draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();