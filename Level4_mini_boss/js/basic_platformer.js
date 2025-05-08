//Declare my variables

var canvas;
var context;
var timer;
var interval;
var player;


	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");	

	player = new GameObject({x:100, y:canvas.height/2-100});

	platform0 = new GameObject();
		platform0.width = 200;
		platform0.x = platform0.width/2;
		platform0.y = canvas.height - platform0.height/3;
		platform0.color = "#66ff33";

		platform1 = new GameObject();
platform1.width = 200;
platform1.x = canvas.width - 600;
platform1.y = canvas.height - 200;
platform1.color = "#28F4FA";

platform2 = new GameObject();
platform2.width = 150;
platform2.x = canvas.width/2;
platform2.y = canvas.height - 300;
platform2.color = "#28FAB9";

platform3 = new GameObject();
platform3.width = 100;
platform3.x = canvas.width - 300;
platform3.y = canvas.height - 400;
platform3.color = "#7BF6FA";


		
	goal = new GameObject({width:24, height:50, x:canvas.width-50, y:100, color:"#00ffff"});
	

	var fX = .85;
	var fY = .99;
	
	var gravity = 1;

	interval = 1000/60;
	timer = setInterval(animate, interval);

function animate()
{
	
	context.clearRect(0,0,canvas.width, canvas.height);	

	if(w && player.canJump && player.vy ==0)
	{
		player.canJump = false;
		player.vy += player.jumpHeight;
	}

	if(a)
	{
		player.vx += -player.ax * player.force;
	}
	if(d)
	{
		player.vx += player.ax * player.force;
	}

	player.vx *= fX;
	player.vy *= fY;
	
	player.vy += gravity;
	
	player.x += Math.round(player.vx);
	player.y += Math.round(player.vy);
	

	while(platform0.hitTestPoint(player.bottom()) && player.vy >=0)
	{
		player.y--;
		player.vy = 0;
		player.canJump = true;
	}
	while(platform0.hitTestPoint(player.left()) && player.vx <=0)
	{
		player.x++;
		player.vx = 0;
	}
	while(platform0.hitTestPoint(player.right()) && player.vx >=0)
	{
		player.x--;
		player.vx = 0;
	}
	while(platform0.hitTestPoint(player.top()) && player.vy <=0)
	{
		player.y++;
		player.vy = 0;
	}

	while(platform1.hitTestPoint(player.top()) && player.vy <=0)
		{
			player.y++;
			player.vy = 0;
		}
		while(platform1.hitTestPoint(player.bottom()) && player.vy >=0)
			{
				player.y--;
				player.vy = 0;
				player.canJump = true;
			}
			while(platform1.hitTestPoint(player.left()) && player.vx <=0)
			{
				player.x++;
				player.vx = 0;
			}
			while(platform1.hitTestPoint(player.right()) && player.vx >=0)
			{
				player.x--;
				player.vx = 0;
			}
			while(platform1.hitTestPoint(player.top()) && player.vy <=0)
			{
				player.y++;
				player.vy = 0;
			}
			
			// Platform 4 collision
			while(platform2.hitTestPoint(player.bottom()) && player.vy >=0)
			{
				player.y--;
				player.vy = 0;
				player.canJump = true;
			}
			while(platform2.hitTestPoint(player.left()) && player.vx <=0)
			{
				player.x++;
				player.vx = 0;
			}
			while(platform2.hitTestPoint(player.right()) && player.vx >=0)
			{
				player.x--;
				player.vx = 0;
			}
			while(platform2.hitTestPoint(player.top()) && player.vy <=0)
			{
				player.y++;
				player.vy = 0;
			}
			
			// Platform 5 collision
			while(platform3.hitTestPoint(player.bottom()) && player.vy >=0)
			{
				player.y--;
				player.vy = 0;
				player.canJump = true;
			}
			while(platform3.hitTestPoint(player.left()) && player.vx <=0)
			{
				player.x++;
				player.vx = 0;
			}
			while(platform3.hitTestPoint(player.right()) && player.vx >=0)
			{
				player.x--;
				player.vx = 0;
			}
			while(platform3.hitTestPoint(player.top()) && player.vy <=0)
			{
				player.y++;
				player.vy = 0;
			}
	
	//---------Objective: Treasure!!!!!!!---------------------------------------------------------------------------------------------------- 
	//---------Run this program first.
	//---------Get Creative. Find a new way to get your player from the platform to the pearl. 
	//---------You can do anything you would like except break the following rules:
	//---------RULE1: You cannot spawn your player on the pearl!
	//---------RULE2: You cannot change the innitial locations of platform0 or the goal! 



	if(player.hitTestObject(goal))
	{
		goal.y = 10000;
		context.textAlign = "center";
		context.drawText("You Win!!!", canvas.width/2, canvas.height/2);
	}
	
	
	platform0.drawRect();
	platform1.drawRect();
    platform2.drawRect();
    platform3.drawRect();

	//Show hit points
	player.drawRect();
	goal.drawCircle();
}

