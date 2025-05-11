var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var interval = 1000/60;
var timer = setInterval(animate, interval);

// Load the sprite sheet
var playerSprite = new Image();
playerSprite.src = "images/player.png";

// Sprite animation variables
var frameWidth = 32; // Width of each frame
var frameHeight = 32; // Height of each frame
var currentFrame = 0;
var frameCount = 4; // Frames per row
var rowCount = 4; // Number of rows
var currentRow = 0;
var animationSpeed = 8;
var frameCounter = 0;

// Animation states
const ANIM_STATES = {
    DOWN: 0,  // First row
    LEFT: 1,  // Second row
    RIGHT: 2, // Third row
    UP: 3     // Fourth row
};

// Frame sequences for each animation state
const FRAME_SEQUENCES = {
    DOWN:  [0, 1, 2, 3],
    LEFT:  [4, 5, 6, 7],
    RIGHT: [8, 9, 10, 11],
    UP:    [12, 13, 14, 15]
};

var player = new GameObject({width:25, height:26, angle:0, x:canvas.width/2, y:canvas.height-100, force:1})
var goal = new GameObject({width:50, height:50, angle:0, x:canvas.width/2, y:canvas.height-100, force:1, color:"red"})
goal.world.x = 1740;
goal.world.y = 1700;

var level = new Level();
level.generate(level.l1, 150,150);		

var fx = .85;
var fy = .85;

var states =[];
var currentState = "play";

function getFrameCoordinates(frameNumber) {
    const row = Math.floor(frameNumber / 4);
    const col = frameNumber % 4;
    return { x: col * frameWidth, y: row * frameHeight };
}

states["play"] = function()
{
    let isMoving = false;
    let currentDirection = ANIM_STATES.DOWN; // Default direction

    // Movement logic
    if(w)
    {
        player.vy += player.ay * -player.force;
        currentDirection = ANIM_STATES.UP;
        isMoving = true;
    }
    if(a)
    {
        player.vx += player.ax * -player.force;
        currentDirection = ANIM_STATES.LEFT;
        isMoving = true;
    }
    if(s)
    {
        player.vy += player.ay * player.force;
        currentDirection = ANIM_STATES.DOWN;
        isMoving = true;
    }
    if(d)
    {
        player.vx += player.ax * player.force;
        currentDirection = ANIM_STATES.RIGHT;
        isMoving = true;
    }
    
    player.vx *= fx;
    player.vy *= fy;
    
    player.x += player.vx;
    player.y += player.vy;
    
    var offset = {x:player.vx, y:player.vy};
    
    // Collision detection
    for(var i = 0; i < level.grid.length; i++)
    {
        level.grid[i].drawRect();
        while(level.grid[i].hitTestPoint(player.top()) && player.vy <= 0)
        {
            player.vy = 0;
            player.y++;
            offset.y++;
        }
        while(level.grid[i].hitTestPoint(player.right()) && player.vx >= 0)
        {
            player.vx = 0;
            player.x--;
            offset.x--;
        }
        while(level.grid[i].hitTestPoint(player.left()) && player.vx <= 0)
        {
            player.vx = 0;
            player.x++;
            offset.x++;
        }
        while(level.grid[i].hitTestPoint(player.bottom()) && player.vy >= 0)
        {
            player.canJump = true;
            player.vy = 0;
            player.y--;
            offset.y--;
        }
    }

    if(player.hitTestObject(goal)){
        console.log("hit goal");
    }

    player.x -= offset.x;
    player.y -= offset.y;
    goal.x -= offset.x;
    goal.y -= offset.y;
    level.x -= offset.x;
    level.y -= offset.y;
    
    // Animation logic
    if (isMoving) {
        frameCounter++;
        if (frameCounter >= animationSpeed) {
            currentFrame = (currentFrame + 1) % 4;
            frameCounter = 0;
        }
    } else {
        currentFrame = 0; // Reset to first frame when idle
    }

    // Calculate which frame to show
    const frameNumber = FRAME_SEQUENCES[Object.keys(ANIM_STATES)[currentDirection]][currentFrame];
    const frameCoords = getFrameCoordinates(frameNumber);

    // Draw the sprite
    context.drawImage(
        playerSprite,
        frameCoords.x,
        frameCoords.y,
        frameWidth,
        frameHeight,
        player.x - player.width/2,
        player.y - player.height/2,
        player.width,
        player.height
    );

    goal.drawRect();
}

function animate()
{
    context.clearRect(0,0,canvas.width, canvas.height);	
    states[currentState]();
}