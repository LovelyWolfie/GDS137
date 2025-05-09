class SpriteAnimation {
    constructor(options) {
        this.image = new Image();
        this.image.src = options.spriteSheet;
        this.frameWidth = options.frameWidth;
        this.frameHeight = options.frameHeight;
        this.totalFrames = options.totalFrames;
        this.fps = options.fps || 12;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.animations = {};
        this.currentAnimation = null;
        this.isPlaying = false;
        this.scale = options.scale || 1;
    }

    // Add animation sequence
    addAnimation(name, sequence) {
        this.animations[name] = {
            sequence: sequence,
            frameCount: sequence.length
        };
    }

    // Play specific animation
    play(animationName) {
        if (this.currentAnimation !== animationName) {
            this.currentAnimation = animationName;
            this.currentFrame = 0;
            this.isPlaying = true;
        }
    }

    // Update animation frame
    update(deltaTime) {
        if (!this.isPlaying) return;

        this.frameTimer += deltaTime;
        if (this.frameTimer >= 1000 / this.fps) {
            this.frameTimer = 0;
            this.currentFrame++;

            if (this.currentFrame >= this.animations[this.currentAnimation].frameCount) {
                this.currentFrame = 0;
            }
        }
    }

    // Draw current frame
    draw(ctx, x, y) {
        if (!this.currentAnimation) return;

        const sequence = this.animations[this.currentAnimation].sequence;
        const frameIndex = sequence[this.currentFrame];
        const row = Math.floor(frameIndex / (this.image.width / this.frameWidth));
        const col = frameIndex % (this.image.width / this.frameWidth);

        ctx.drawImage(
            this.image,
            col * this.frameWidth,
            row * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            x,
            y,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale
        );
    }
}

// Example usage:
const playerSprite = new SpriteAnimation({
    spriteSheet: 'path/to/your/spritesheet.png',
    frameWidth: 64,
    frameHeight: 64,
    totalFrames: 36,
    fps: 12,
    scale: 1.5
});

// Define animations
playerSprite.addAnimation('idle', [0, 1, 2, 3]);
playerSprite.addAnimation('run', [4, 5, 6, 7, 8, 9]);
playerSprite.addAnimation('jump', [10, 11, 12, 13]);
playerSprite.addAnimation('attack', [14, 15, 16, 17, 18]);

// Game state management
class GameState {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastTime = 0;
        this.playerState = 'idle';
    }

    // Game loop
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update animation
        playerSprite.play(this.playerState);
        playerSprite.update(deltaTime);

        // Draw sprite
        playerSprite.draw(this.ctx, 100, 100);

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    // Start game
    start() {
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Character class with animations
class Character {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = new SpriteAnimation({
            spriteSheet: 'character_sheet.png',
            frameWidth: 64,
            frameHeight: 64,
            totalFrames: 36,
            fps: 12
        });

        // Initialize animations
        this.initializeAnimations();
        this.currentState = 'idle';
        this.facing = 'right';
    }

    initializeAnimations() {
        // Add different animation states
        this.sprite.addAnimation('idle', [0, 1, 2, 3]);
        this.sprite.addAnimation('run', [4, 5, 6, 7, 8, 9]);
        this.sprite.addAnimation('jump', [10, 11, 12]);
        this.sprite.addAnimation('fall', [13, 14]);
        this.sprite.addAnimation('attack', [15, 16, 17, 18, 19]);
    }

    update(deltaTime) {
        // Update animation based on state
        this.sprite.play(this.currentState);
        this.sprite.update(deltaTime);

        // Update state based on movement/actions
        this.updateState();
    }

    draw(ctx) {
        // Draw with proper facing direction
        ctx.save();
        if (this.facing === 'left') {
            ctx.scale(-1, 1);
            this.sprite.draw(ctx, -this.x - this.sprite.frameWidth, this.y);
        } else {
            this.sprite.draw(ctx, this.x, this.y);
        }
        ctx.restore();
    }

    updateState() {
        // Example state updates based on movement
        if (this.isMoving) {
            this.currentState = 'run';
        } else if (this.isJumping) {
            this.currentState = 'jump';
        } else if (this.isAttacking) {
            this.currentState = 'attack';
        } else {
            this.currentState = 'idle';
        }
    }
}

// Effect animation class
class EffectAnimation {
    constructor(options) {
        this.sprite = new SpriteAnimation(options);
        this.isComplete = false;
        this.onComplete = options.onComplete || null;
    }

    play(x, y) {
        this.x = x;
        this.y = y;
        this.sprite.play('default');
        this.isComplete = false;
    }

    update(deltaTime) {
        if (this.isComplete) return;

        this.sprite.update(deltaTime);
        
        // Check if animation is complete
        if (this.sprite.currentFrame === 0) {
            this.isComplete = true;
            if (this.onComplete) this.onComplete();
        }
    }

    draw(ctx) {
        if (!this.isComplete) {
            this.sprite.draw(ctx, this.x, this.y);
        }
    }
}

// Example effect creation:
const explosionEffect = new EffectAnimation({
    spriteSheet: 'explosion_sheet.png',
    frameWidth: 128,
    frameHeight: 128,
    totalFrames: 12,
    fps: 24,
    onComplete: () => console.log('Explosion animation complete')
});

// Animation Manager
class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.effects = [];
    }

    addCharacter(id, character) {
        this.animations.set(id, character);
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    update(deltaTime) {
        // Update all character animations
        this.animations.forEach(character => {
            character.update(deltaTime);
        });

        // Update and filter completed effects
        this.effects = this.effects.filter(effect => {
            effect.update(deltaTime);
            return !effect.isComplete;
        });
    }

    draw(ctx) {
        // Draw characters
        this.animations.forEach(character => {
            character.draw(ctx);
        });

        // Draw effects
        this.effects.forEach(effect => {
            effect.draw(ctx);
        });
    }
}
