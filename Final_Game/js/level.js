function Level()
{
    // Modified level array with 4 goals in different open areas
    this.l1 = [
        [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        [2,1,0,0,2,0,0,0,0,2,0,0,0,0,2,0,0,0,0,2], // Player start
        [2,0,2,0,2,0,2,2,0,2,0,2,2,0,2,0,2,2,0,2],
        [2,0,2,0,0,0,0,2,0,0,0,0,2,0,0,0,0,2,0,2],
        [2,0,2,2,2,2,0,2,2,2,2,0,2,2,2,2,0,2,0,2],
        [2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,3,0,0,0,2], // Open Area 1 with Goal 1
        [2,0,2,2,2,2,0,2,2,0,2,0,2,2,2,2,0,2,0,2],
        [2,0,0,0,0,2,0,2,0,0,0,0,2,0,0,0,0,2,0,2],
        [2,2,2,2,0,2,0,2,0,2,2,2,2,0,2,2,2,2,0,2],
        [2,0,0,0,0,2,0,0,3,0,0,0,0,0,0,0,0,0,0,2], // Open Area 2 with Goal 2
        [2,0,2,2,2,2,2,2,0,2,2,0,2,2,2,2,2,2,0,2],
        [2,0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,0,0,0,2],
        [2,2,2,2,2,2,0,2,0,2,0,2,2,2,2,2,2,2,0,2],
        [2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,3,0,0,0,2], // Open Area 3 with Goal 3
        [2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2], // Open Area 4
        [2,0,2,2,2,2,2,2,0,2,2,2,2,0,2,2,2,2,0,2],
        [2,0,0,0,0,0,0,2,0,2,0,0,0,0,2,0,0,0,0,2],
        [2,2,2,2,2,2,0,2,0,2,0,2,2,2,2,0,2,2,2,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2], // Open Area 5
        [2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,2], // Goal 4
        [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ];
    
    // Add variables to track goals
    this.totalGoals = 4;
    this.goalsCollected = 0;
    
    this.grid = [];
    this.x = 0;
    this.y = 0;
    
    this.generate = function(level, width, height)
    {
        var tileWidth; 
        var tileHeight;
        
        if(width != undefined)
        {
            tileWidth = width;
        }
        else
        {
            tileWidth = canvas.width/level[0].length;
        }
        
        if(height != undefined)
        {
            tileHeight = height;
        }
        else
        {
            tileHeight = canvas.height/level.length;
        }
    
        var g = 0;
        var goalCount = 0;
        var x = tileWidth/2;
        var y = tileHeight/2;
        
        for(var r = 0; r < level.length; r++)
        {
            for(var c = 0; c < level[r].length; c++)
            {
                switch(level[r][c])
                {
                    case 0: // Empty space (pathway)
                        break;
                    
                    case 1: // Player start
                        player.x = x;
                        player.y = y;
                        break;
                    
                    case 2: // Walls
                        this.grid[g] = new GameObject({width:tileWidth, height:tileHeight, world:this});
                        this.grid[g].x = x;
                        this.grid[g].y = y;
                        this.grid[g].color = "#663c08";
                        g++;
                        break;

                    case 3: // Goals
                        // Create an array of goals if it doesn't exist
                        if(!this.goals) {
                            this.goals = [];
                        }
                        
                        // Create new goal object
                        this.goals[goalCount] = new GameObject({
                            width: tileWidth/2,
                            height: tileHeight/2,
                            world: this,
                            color: "#FFD700" // Gold color for goals
                        });
                        this.goals[goalCount].x = x;
                        this.goals[goalCount].y = y;
                        this.goals[goalCount].isCollected = false;
                        goalCount++;
                        break;
                }
                x += tileWidth;
            }
            y += tileHeight;
            x = tileWidth/2;
        }
    }

    // Add method to check goal collection
    this.checkGoals = function(player) {
        if(!this.goals) return;
        
        for(var i = 0; i < this.goals.length; i++) {
            if(!this.goals[i].isCollected && this.goals[i].hitTestObject(player)) {
                this.goals[i].isCollected = true;
                this.goalsCollected++;
                console.log("Goal collected! " + this.goalsCollected + "/" + this.totalGoals);
                
                // Check if all goals are collected
                if(this.goalsCollected >= this.totalGoals) {
                    console.log("All goals collected! You win!");
                    // Add your win condition handling here
                }
            }
        }
    }

    // Add method to draw goals
    this.drawGoals = function(context) {
        if(!this.goals) return;
        
        for(var i = 0; i < this.goals.length; i++) {
            if(!this.goals[i].isCollected) {
                this.goals[i].drawRect();
            }
        }
    }
}
