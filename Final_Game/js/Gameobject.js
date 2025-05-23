
/*------------------------------------------------------------------------------------------------------------------
IMPORTANT: This file has been modified with an additional "world" property. If you don't want an object to move within the level it's "world" property should be set to {x:0, y:0}. Typically the player's world is {x:0, y:0}, while everything in the level will use the level object as it's world.
--------------------------------------------------------------------------------------------------------------------*/

function GameObject(obj)
{	
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.width = 100;
		this.height = 100;
		this.color = "#ff0000";
		this.force = 1;
		this.ax = 1;
		this.ay = 1;
		this.vx = 0;
		this.vy = 0;
		this.world = {x:0, y:0};
	
	
		
		//the angle that the graphic is drawn facing.
		this.angle = 0;
		
		
		//------Allows us to pass object literals into the class to define its properties--------//
		//------This eliminate the need to pass in the property arguments in a specific order------------//
		if(obj!== undefined)
		{
			for(value in obj)
			{
				if(this[value]!== undefined)
				this[value] = obj[value];
			}
		}
	
	
	//whether or not the object can jump
	this.canJump = false;
	this.jumpHeight = -35;
	

	this.drawRect = function()
	{
		context.save();
			context.fillStyle = this.color;
			context.translate(this.x + this.world.x, this.y + this.world.y);
			context.fillRect((-this.width/2), (-this.height/2), this.width, this.height);
		context.restore();
		
	}	
	
	this.drawCircle = function()
	{
		context.save();
			context.fillStyle = this.color;
			context.beginPath();
			context.translate(this.x + this.world.x, this.y + this.world.y);
			context.arc(0, 0, this.radius(), 0, 360 *Math.PI/180, true);
			context.closePath();
			context.fill();
		context.restore();
		
	}	
	
	//draws a triangle
	this.drawTriangle = function()
	{
			context.save();
			context.fillStyle = this.color;
			context.translate(this.x + this.world.x, this.y + this.world.y);
			//To convert deg to rad multiply deg * Math.PI/180
			context.rotate(this.angle * Math.PI/180);
			context.beginPath();
				context.moveTo(0+ this.width/2, 0);
				context.lineTo(0 - this.width/2, 0 - this.height/2);
				context.lineTo(0 - this.width/2, 0 + this.height/2);
				context.closePath();
			context.fill();
		context.restore();
		
	}	
	
	this.move = function()
	{
		this.x += this.vx;
		this.y += this.vy;
	}
	
	
	//---------Returns object's for the top, bottom, left and right of an object's bounding box.
	this.left = function() 
	{
		return {x:this.x - this.width/2 , y:this.y, world:this.world}
	}
	this.right = function() 
	{
		return {x:this.x + this.width/2 , y:this.y, world:this.world}
	}
	
	this.top = function() 
	{
		return {x:this.x, y:this.y - this.height/2, world:this.world}
	}
	this.bottom = function() 
	{
		return {x:this.x , y:this.y + this.height/2, world:this.world}
	}
	
	this.hitTestObject = function(obj)
	{
		if(this.left().x + this.world.x <= obj.right().x + obj.world.x && 
		   this.right().x + this.world.x >= obj.left().x + obj.world.x &&
		   this.top().y + this.world.y <= obj.bottom().y + obj.world.y &&
		   this.bottom().y + this.world.y >= obj.top().y + obj.world.y)
		{
			return true
		}
		return false;
	}
		
	//------Tests whether a single point overlaps the bounding box of another object-------
	this.hitTestPoint = function(obj)
	{
		if(obj.x + obj.world.x >= this.left().x + this.world.x && 
		   obj.x + obj.world.x <= this.right().x + this.world.x &&
		   obj.y + obj.world.y >= this.top().y + this.world.y &&  
		   obj.y + obj.world.y <= this.bottom().y + this.world.y)
		{
			return true;
		}
		return false;
	}
	
	/*-----Sets or gets the radius value--------*/
	this.radius = function(newRadius)
	{
		 if(newRadius==undefined)
		 {
			return this.width/2; 
		 }
		 else
		 {
			 return newRadius;
		 }
	}
	
	//Draws the collision points
	this.drawDebug = function()
	{
		var size = 5;
		context.save();
		context.fillStyle = "black";
		context.fillRect(this.left().x-size/2, this.left().y-size/2, size, size);
		context.fillRect(this.right().x-size/2, this.right().y-size/2, size, size);
		context.fillRect(this.top().x-size/2, this.top().y-size/2, size, size);
		context.fillRect(this.bottom().x-size/2, this.bottom().y-size/2, size, size);
		context.fillRect(this.x-size/2, this.y-size/2, size, size);
		context.restore();
	}
}

