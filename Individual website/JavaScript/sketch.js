/*
The Game Project 6
*/
var canvas = document.querySelector('canvas')
var char;
var collectable;
var charposx;
var charposy;
var canyon;

var cloud;
var mountain;
var trees_x;

var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var collectableisFound = [false,false,false];

var game_score; 
var flagpole;
var lives;

function setup()
{
	createCanvas(1332, 578);
	floorPos_y = height * 3/4;
    lives = 4;
    startGame();
}

function draw()
{
	background(100, 155, 255); // fill the sky blue
    stroke(0);
	noStroke();
    text("score:"+game_score+" Lives:"+lives,50,50)
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    push();
    translate(scrollPos,0)
    
    //render background objects
    renderFlagpole();
    drawCloud();
    drawMountains();
    drawTrees();
    
    //draw canyons
for (var boi =0; boi<canyon.x_pos.length; boi++)
     {
     drawCanyon(canyon.x_pos[boi],canyon.width);
     checkCanyon(canyon.x_pos[boi],canyon.width);
     }
    
	// Draw collectable items.
for (var boi =0; boi<collectable.x_pos.length; boi++)
     { 
      if(collectableisFound[boi] == false)
        { 
            drawCollectable(
                            collectable.x_pos[boi],
                            collectable.y_pos,
                            collectableisFound[boi],
                            collectable.size
                            );
            
            checkCollectable(
                             collectable.x_pos[boi],
                             collectable.y_pos,boi
                            );
        } 
      }
    
    
    pop();
    //renders character
	drawGameChar();
    
    //Lives counter
    if (lives<1)
        {
        text("Game Over, Press space to continue",width/2-300,height/2)
            return;
        }
    
    //flagpole checker
    if (flagpole.isReached == true)
        {
        text("Level Complete, Press space to continue",width/2-300, height/2)
            return;
        }
    
    //draw lives
    for (var i=0; i<lives;i++)
    {
        fill(255,127,80)
        stroke(0)
        rect(width/2,20,lives*100,50)
    }

	// Logic to make the game character move or the background scroll.
    if (isPlummeting == true)
    {
            charposy +=5; 
            isRight = false
            isLeft = false
            isFalling = true
    }
    
	if(isLeft)
	{
		if(charposx> width * 0.2)
		{
        charposx -= 5;
		}
		else
		{
        scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(charposx < width * 0.8)
		{
        charposx  += 5;
		}
		else
		{
        scrollPos -= 5; 
		}
	}
    
    //flag pole checking
    if (flagpole.isReached != true){
        checkFlagpole();
        console.log("check flaggy")
    }

	// Logic to make the game character rise and fall.
    if (charposy < floorPos_y+5||isPlummeting == true)
    {
        charposy +=5
        isFalling = true
    }
    else
    {
        isFalling = false
    }
    
	//collision detection.
	gameChar_world_x = charposx - scrollPos;
    
    //Death reset
    if (charposy > height)
    { 
        if (lives>0)
        {
        startGame();
        }
    }

}


function keyPressed()
{
    
    if(flagpole.isReached && key == ' ')
    {
    nextLevel();
    return
    }
    else if(lives == 0 && key == ' ')
    {
    returnToStart();
    return
    }
    

    if(key == 'A' || keyCode == 37)
	{
    isLeft = true;
	}

    if(key == 'D' || keyCode == 39)
	{
    isRight = true;
	}
    
    if ((keyCode == 32)&&(charposy > 430)&&(isFalling == false))
    {    
    charposy-=300  
    isFalling = true
    }

}

function keyReleased()
{
  	if(key == 'A' || keyCode == 37)
	{
    isLeft = false;
	}

	if(key == 'D' || keyCode == 39)
	{
    isRight = false;
	}
}

// Function to draw the game character.

function drawGameChar()
{
	
    if(isLeft && isFalling)
	{
		//jumping-left code
    fill(255,153,0)
    ellipse(charposx,charposy-37,char.bodyRadius-10,char.bodyRadius+10);
    fill(255)
    stroke(255,153,0);
    ellipse(charposx-8,charposy-63,char.eyeRadius,char.eyeRadius);
    ellipse(charposx+8,charposy-63,char.eyeRadius,char.eyeRadius);
    stroke(0,0,0);
    rect(charposx -11,charposy-15,char.shoeheight,char.shoelength,30)
    rect(charposx +1,charposy-15,char.shoeheight,char.shoelength,30)
    fill(0)
    ellipse(charposx-10,charposy-65,4,4);
    ellipse(charposx+6,charposy-65,4,4);
    noFill()
    fill(255)
    textSize(35)
    text("₿",charposx-10,charposy-24)
    noFill()
	}
    
	else if(isRight && isFalling)
	{
		//jumping-right code
    fill(255,153,0)
    ellipse(charposx,charposy-37,char.bodyRadius-10,char.bodyRadius+10);
    fill(255)
    stroke(255,153,0);
    ellipse(charposx-8,charposy-63,char.eyeRadius,char.eyeRadius);
    ellipse(charposx+8,charposy-63,char.eyeRadius,char.eyeRadius);
    stroke(0,0,0);
    rect(charposx -11,charposy-15,char.shoeheight,char.shoelength,30)
    rect(charposx +1,charposy-15,char.shoeheight,char.shoelength,30)
    fill(0)
    ellipse(charposx-6,charposy-65,4,4);
    ellipse(charposx+10,charposy-65,4,4);
    noFill()
    fill(255)
    textSize(35)
    text("₿",charposx-10,charposy-24)
    noFill()
	}
    
	else if(isLeft)
	{
		//walking left code
    fill(255,153,0)
    ellipse(charposx,charposy-37,char.bodyRadius,char.bodyRadius);
    fill(255)
    stroke(255,153,0);
    ellipse(charposx-8,charposy-60,char.eyeRadius,char.eyeRadius);
    ellipse(charposx+8,charposy-60,char.eyeRadius,char.eyeRadius);
    stroke(0,0,0);
    rect(charposx -21,charposy-15,char.shoelength,char.shoeheight,30)
    rect(charposx +1,charposy-15,char.shoelength,char.shoeheight,30)
    fill(0)
    ellipse(charposx-10,charposy-60,4,4);
    ellipse(charposx+6,charposy-60,4,4);
    noFill()
    fill(255)
    textSize(35)
    text("₿",charposx-10,charposy-24)
    noFill()

	}
	else if(isRight)
	{
		//walking right code
    fill(255,153,0)
    ellipse(charposx,charposy-37,char.bodyRadius,char.bodyRadius);
    fill(255)
    stroke(255,153,0);
    ellipse(charposx-8,charposy-60,char.eyeRadius,char.eyeRadius);
    ellipse(charposx+8,charposy-60,char.eyeRadius,char.eyeRadius);
    stroke(0,0,0);
    rect(charposx -21,charposy-15,char.shoelength,char.shoeheight,30)
    rect(charposx +1,charposy-15,char.shoelength,char.shoeheight,30)
    fill(0)
    ellipse(charposx-6,charposy-60,4,4);
    ellipse(charposx+10,charposy-60,4,4);
    noFill()
    fill(255)
    textSize(35)
    text("₿",charposx-10,charposy-24)
    noFill()
	}
    
	else if(isFalling || isPlummeting)
	{
		//jumping facing forwards code
    fill(255,153,0)
    ellipse(charposx,charposy-37,char.bodyRadius-10,char.bodyRadius+10);
    fill(255)
    stroke(255,153,0);
    ellipse(charposx-8,charposy-63,char.eyeRadius,char.eyeRadius);
    ellipse(charposx+8,charposy-63,char.eyeRadius,char.eyeRadius);
    stroke(0,0,0);
    rect(charposx -11,charposy-15,char.shoeheight,char.shoelength,30)
    rect(charposx +1,charposy-15,char.shoeheight,char.shoelength,30)
    fill(0)
    ellipse(charposx-8,charposy-65,4,4);
    ellipse(charposx+8,charposy-65,4,4);
    noFill()
    fill(255)
    textSize(35)
    text("₿",charposx-10,charposy-24)
    noFill()
	}
    
	else
	{
		//standing front facing code
    fill(255,153,0);
    ellipse(charposx,charposy - 37,char.bodyRadius,char.bodyRadius);
    fill(255)
    stroke(255,153,0);
    ellipse(charposx-8,charposy-60,char.eyeRadius,char.eyeRadius);
    ellipse(charposx+8,charposy-60,char.eyeRadius,char.eyeRadius);
    stroke(0,0,0);
    rect(charposx -21,charposy-15,char.shoelength,char.shoeheight,30)
    rect(charposx +1,charposy-15,char.shoelength,char.shoeheight,30)
    fill(0)
    ellipse(charposx-8,charposy-60,4,4);
    ellipse(charposx+8,charposy-60,4,4);
    noFill()
    fill(255)
    textSize(35)
    text("₿",charposx-10,charposy-24)
    noFill()
    }
}

// Function to draw cloud objects.
function drawCloud()
{
     for(i=0;i<4;i++)
    {
    fill(255,255,255);
    ellipse(cloud.x[i],cloud.y[i],cloud.size,cloud.size);
    ellipse(cloud.x[i]+100,cloud.y[i],cloud.size,cloud.size,);
    ellipse(cloud.x[i]+50,cloud.y[i],cloud.size+20,cloud.size+30);
	noStroke();
	fill(255);
    }
}
// Function to draw mountains objects.
function drawMountains()
{
    for(i=0;i<4;i++)
    {
    fill(151,124,83);
    stroke(0)
    triangle(
             mountain.x[i]+ 522,
             mountain.y+207,
             mountain.x[i]+430,
             floorPos_y,mountain.x[i]+630,
             floorPos_y
            );
    
    fill(255,255,255);
    triangle(
             mountain.x[i]+522,
             mountain.y+207,
             mountain.x[i]+504,
             mountain.y+252,
             mountain.x[i]+545,
             mountain.y+252
            )
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(i=0; i<8; i++)
    {
    stroke(0);
    fill(83, 49, 24);
    rect(trees_x[i],338,20,94);
    fill(0,100,0);
    ellipse(trees_x[i]+10,315,60,60);
    ellipse(trees_x[i]-11,335,60,60);
    ellipse(trees_x[i]+25,335,60,60);
    }
	noStroke(); 
}

// Function to draw canyon objects.

function drawCanyon(boix,boiwidth)
{
    fill(129,62,36);
    rect(boix,431,boiwidth+26,600);
    fill(100,155,255);
    rect(boix+13,431,boiwidth,600,50);   
}

// Function to check character is over a canyon.

function checkCanyon(boix,boiwidth)
{
    if ((gameChar_world_x>boix+37&&gameChar_world_x<boix-30+boiwidth)&&(charposy >= floorPos_y))
    {
    isPlummeting = true
    }  
}

// Function to draw collectable objects.

function drawCollectable(x_pos,y_pos,isFound,size,boi)
{
    if (isFound == false)
    {
    fill(200,194,70);
    rect(x_pos-5,y_pos-22,20,size - 18,size);    
    stroke(0,0,0)
    textSize(size-32)
    text("$", x_pos,y_pos);
    noStroke()
    }
}

// Function to check character has collected an item.

function checkCollectable(x_pos,y_pos,boi)
{
    if (dist(x_pos,y_pos, gameChar_world_x, charposy-63)<60)
    {
    collectableisFound[boi] = true
    game_score +=1;
    }
}

function renderFlagpole()
{
    push();
    stroke(0)
    fill(100,110,100)
    rect(flagpole.xpos,flagpole.ypos,5,floorPos_y);
    noFill(0);
    
    if (flagpole.isReached)
    {
    stroke(0);
    fill(0,255,0);
    rect(flagpole.xpos-5,flagpole.ypos,15,floorPos_y/2);
    }
    else 
    {
    stroke(0);
    fill(255,0,0);
    rect(flagpole.xpos-5,floorPos_y/2,15,floorPos_y/2);
    }
    pop();
    
}

function checkFlagpole(d)
{
    var d = abs(gameChar_world_x - flagpole.xpos);
    if (d <50)
    {
    flagpole.isReached = true;
    }
}

function startGame()
{
    
	charposx = width/2;
	charposy = floorPos_y;
    
	//Variable to control the background scrolling.
	scrollPos = 0;

	//real position of the gameChar in the game
	gameChar_world_x = charposx - scrollPos;

	//control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	//Initialisation of scenery objects.
    
    trees_x = [100,400,800,1300,1700,2300,2700,3200]
    
    cloud = 
        {
        size: 100,
        x:[200,1000,2800,1900], 
        y:[100,200,150,75]
        }
    
    mountain = 
        {
        x:[0,1000,1700],
        y:0,
        }
    
    collectable = 
        {
        x_pos:[100,1600,2400], 
        y_pos:418,
        size: 50,
        };
    
    canyon = 
        {
        x_pos: [68,2900,1300,2400],
        width: 150
        };
    
    char = 
        {
        bodyRadius: 50, 
        eyeRadius: 10,
        pupilradius:0,
        shoelength:20,
        shoeheight:8,
        charposx:100,
        charposy:floorPos_y,      
        };
    
    //game mechanics
    game_score = 0;
    
    flagpole = 
        {
        isReached: false,
        xpos: 3300,
        ypos: 0  
        }
    
    lives -=1;
    
}
