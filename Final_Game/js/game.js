var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var interval = 1000/60;
var timer = setInterval(animate, interval);
//read the comments I made Jojo
// Load the sprite sheet
var playerSprite = new Image();
playerSprite.src = "images/player.png";

// Sprite animation variables
var frameWidth = 25; // Adjust based on your sprite sheet, figure it out it not that hard
//if you still can't get it, Jojo. Ask for your teacher help and tell them about your disability.
var frameHeight = 25; // Adjust based on your sprite sheet
var currentFrame = 0;
var frameCount = 4; // Number of frames in each row, it sould have the correct row and column I think.
var rowCount = 4; // Number of rows
var currentRow = 0; // Current animation row
var animationSpeed = 8; // Adjust to control animation speed
var frameCounter = 0;
//you can do it Jojo, I believe in you.
var player = new GameObject({width:25, height:25, angle:0, x:canvas.width/2, y:canvas.height-100, force:1})
var goal = new GameObject({width:50, height:50, angle:0, x:canvas.width/2, y:canvas.height-100, force:1, color:"red"})
goal.world.x = 1740;
goal.world.y = 1700;

var level = new Level();
level.generate(level.l1, 150,150);		

var fx = .85;
var fy = .85;

var states =[];
var currentState = "play";

states["play"] = function()
{
    // Movement logic
    if(w)
    {
        player.vy += player.ay * -player.force;
        currentRow = 3; // Up animation row
    }
    if(a)
    {
        player.vx += player.ax * -player.force;
        currentRow = 1; // Left animation row
    }
    if(s)
    {
        player.vy += player.ay * player.force;
        currentRow = 0; // Down animation row
    }
    if(d)
    {
        player.vx += player.ax * player.force;
        currentRow = 2; // Right animation row
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
    
    // Animate sprite
    frameCounter++;
    if (frameCounter >= animationSpeed) {
        currentFrame = (currentFrame + 1) % frameCount;
        frameCounter = 0;
    }

    // Draw sprite, meaning your frame 
    if (Math.abs(player.vx) > 0.1 || Math.abs(player.vy) > 0.1) {
        context.drawImage(
            playerSprite,
            currentFrame * frameWidth,
            currentRow * frameHeight,
            frameWidth,
            frameHeight,
            player.x - player.width/2,
            player.y - player.height/2,
            player.width,
            player.height
        );
    } else {
        // Draw idle frame (first frame of current direction)
        context.drawImage(
            playerSprite,
            0,1,
            currentRow * frameHeight,
            frameWidth, 29,
            frameHeight,
            player.x - player.width/2,
            player.y - player.height/2,
            player.width,
            player.height
        );
    }
//Jojo again figure it out first for yourself if you can't do it, ask your teacher.
    goal.drawRect();
}

function animate()
{
    context.clearRect(0,0,canvas.width, canvas.height);	
    states[currentState]();
}