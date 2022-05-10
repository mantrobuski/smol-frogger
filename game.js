const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//turn off anti-ailiasing
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
const framerate = 1000.0/(50.0); //change the denom to whatever framerate you want


//images
const backgroundImage = document.getElementById('background');
const frogImage = document.getElementById('frog');
const car1Image = document.getElementById('car1');
const car2Image = document.getElementById('car2');
const car3Image = document.getElementById('car3');



document.addEventListener("keydown", keyDownHandler, false);
//document.addEventListener("keyup", keyUpHandler, false);


//game variables, I'm using type b/c ATTiny is based on C
const maxTime = 1000; //int
let time; //int
let framecount; //int
let endScreen; //bool
let score; //int
let highScore = 50; //int

let x = 4; y = 8; //int
let farthestY; //int

//these are seperate and not 2D arrays cause they move at different speeds and the middle slice is different from  the edge ones
let car1 = [], car2 = [], car3 = []; //bool
let water1 = [], water2 = [], water3 = []; //bool

//bigger is actually slower
let vcar1 = 17; vcar2 = 13; vcar3 = 10; //int
let vwater1 = 8; vwater2 = 7; vwater3 = 10; //int

//8x9 grid, grid squares are 8x12 pixels

//start game
initialize();

//sets the game to random setup initially
function initialize()
{	
	respawn();

	//cars


	//2 wide padding on each side so a car can spawn off screen
	for(var i = 0; i < 12; i++)
	{
		//lane 1, 2 cars approximately, so 25% chance for car
		if(Math.random() < 0.25) car1[i] = true;
		else car1[i] = false;

		//lane 2 3 cars approx 3/8 chance, 37.5%
		if(Math.random() < 0.375) car2[i] = true;
		else car2[i] = false;

		//double sized cars 1/8 chance, 12.5%
		//double sized so only trying to spawn every other block and then adding them to both spots
		if(i % 2 == 0)
		{
			if(Math.random() < 0.125)
			{
				car3[i] = true;
				car3[i + 1] = true;
			}

			else
			{
				car3[i] = false;
				car3[i + 1] = false;
			}
		}
	}

	//water

	//3 wide padding cause biggest log will be 3 wide
	//screen starts at i = 3 for lanes 1 and 3, i = 0 for lane 2
	for(var i = 0; i < 14; i++)
	{
		//lane 1, 2 wide log, very high chance to spawn
		if(i % 2 == 0)
		{
			if(Math.random() < 0.6)
			{
				water1[i] = true;
				water1[i + 1] = true;
			}

			else
			{
				water1[i] = false;
				water1[i + 1] = false;
			}
		}

		//lane 2, 2 wide turtle
		if(i % 2 == 0)
		{
			if(Math.random() < 0.3)
			{
				water2[i] = true;
				water2[i + 1] = true;
			}

			else
			{
				water2[i] = false;
				water2[i + 1] = false;
			}
		}

		//lane 3, 3 wide log
		if(i % 4 == 0)
		{
			if(Math.random() < 0.125)
			{
				water3[i] = true;
				water3[i + 1] = true;
				water3[i + 2] = true;
				water3[i + 3] = true;
			}

			else
			{
				water3[i] = false;
				water3[i + 1] = false;
				water3[i + 2] = false;
				water3[i + 3] = false;
			}
		}
	}
	
}

//after death
function respawn()
{
	framecount = 0;
	time = maxTime;
	endScreen = false;
	score = 0;
	farthestY = 0;

	x = 4; y = 8;
}

function draw()
{
	//clears canvas each frame before drawing
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(endScreen)
	{
		


		
		background();
		drawCars();
		drawWater();
		timeScore();
		// ?frog();

		//red haze
		ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
		ctx.fillRect(0, 0, 64, 128);

		ctx.fillStyle = 'black';
		ctx.font = '16px Silkscreen';
		ctx.fillText('SHIT', 16, 50);
		ctx.fillText('ON', 20, 64);

		//don't do the rest of the draw if dead
		return;
	}

	framecount++;

	checkDeath();
	moveCars();
	moveWater(); //also moves frog here

	if((8 - y) > farthestY)
	{
		score += 10;
		farthestY = 8 - y;
	}

	time--;
	if (time == 0) time = maxTime;

	background();
	drawCars();
	drawWater();
	frog();
	timeScore();
	
}
setInterval(draw, framerate);


//sees if frog should die
function checkDeath()
{
	let dead = false;

	if(x > 7 || x < 0) dead = true;

	//cars
	if(y >= 5 && y <= 7)
	{
		//x+2 because of off screen car padding
		if(y == 5 && car3[x+2]) dead = true;
	
		else if(y == 6 && car2[x]) dead = true;

		else if(y == 7 && car1[x+2]) dead = true;
	}

	//don't check rest of function if already dead, doesn't matter
	if(dead) death();

	else
	{

		//water
		if(y >= 1 && y <= 3)
		{
			console.log('hi00');
			//x+2 because of off screen car padding
			if(y == 1 && water3[x+2] != true) dead = true;
		
			else if(y == 2 && !water2[x]) dead = true;

			else if(y == 3 && !water1[x+2]) dead = true;
		}
	}

	if(dead) death();
	
}

//frog ded :(
function death()
{
	endScreen = true;
	if(score > highScore) highScore = score;

	// ? initialize();
}


//handles car movement and also spawns new ones 
function moveCars()
{
	//this gets called at 50Hz. will use frameCount in ATTiny.

	if(framecount % vcar1 == 0)
	{
		//shift one over
		car1.unshift(false);
		car1.pop();

		//won't spawn two cars right next to each other
		if(car1[1] == false && Math.random() < 0.25) car1[0] = true;
	}

	if(framecount % vcar2 == 0)
	{
		//shift one over (other way though)
		car2.push(false);
		car2.shift();

		//won't spawn two cars right next to each other
		if(car2[car2.length - 2] == false && Math.random() < 0.375) car2[car2.length - 1] = true;
	}

	if(framecount % vcar3 == 0)
	{
		//shift one over
		car3.unshift(false);
		car3.pop();

		//won't spawn two cars right next to each other, since it's two-wide gotta check one spot over extra
		if(car3[2] == false && Math.random() < 0.125) 
		{
			car3[0] = true;
			car3[1] = true;
		}
	}
}

//handles Water movement and also spawns new ones and moves frog
function moveWater()
{
	//this gets called at 50Hz. will use frameCount in ATTiny.

	if(framecount % vwater1 == 0)
	{
		if(y == 3) x += 1;

		//shift one over
		water1.unshift(false);
		water1.pop();

		//two wide gap minimum between logs
		if(water1[0] == false && water1[2] == false && Math.random() < 0.8) 
		{
			water1[0] = true;
			water1[1] = true;
		}
	}

	if(framecount % vwater2 == 0)
	{
		if(y == 2) x -= 1;

		//shift one over (other way though)
		water2.push(false);
		water2.shift();

		//won't spawn two cars right next to each other
		//two wide gap minimum between logs
		if(water2[water2.length - 1] == false && water2[water2.length - 3] == false && Math.random() < 0.3) 
		{
			water2[water2.length - 1] = true;
			water2[water2.length - 2] = true;
		}
	}

	if(framecount % vwater3 == 0)
	{	
		if(y == 1) x += 1;

		//shift one over
		water3.unshift(false);
		water3.pop();

		//won't spawn two cars right next to each other, since it's two-wide gotta check one spot over extra
		if(water3[4] == false && Math.random() < 0.125) 
		{
			water3[0] = true;
			water3[1] = true;
			water3[2] = true;
			water3[3] = true;
		}
	}
}


//drawing the background
function background()
{
	/*
	//top middle end
	ctx.fillStyle = 'green';
	ctx.fillRect(0, 96, 64, 12);
	ctx.fillRect(0, 0, 64, 12);
	ctx.fillRect(0, 48, 64, 12);

	//road
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 60, 64, 36);

	//water
	ctx.fillStyle = 'blue';
	ctx.fillRect(0, 12, 64, 36);
	*/

	//the image file is one slice, scales it up and tiles it across the width of the screen
	for(var i = 0; i < canvas.width/8; i++)
	{
		ctx.drawImage(backgroundImage, i*8, 0, backgroundImage.width * 8, backgroundImage.height*12);
	}
	

}

//drawing frog
function frog()
{
	/*
	ctx.fillStyle = 'red';
	//ctx.fillRect(x*8 + 1, y*12 + 1, 6, 10);

	//head
	ctx.fillRect(x*8 + 2, y*12 + 2, 1, 1);
	ctx.fillRect(x*8 + 5, y*12 + 2, 1, 1);
	ctx.fillStyle = 'lightgreen';
	ctx.fillRect(x*8 + 2, y*12 + 3, 4, 1);

	//body
	ctx.fillRect(x*8 + 3, y*12 + 1, 2, 7);

	//arms
	ctx.fillRect(x*8, y*12 + 3, 1, 1);
	ctx.fillRect(x*8 + 1, y*12 + 4, 1, 2);
	ctx.fillRect(x*8 + 1, y*12 + 5, 6, 1);
	ctx.fillRect(x*8 + 6, y*12 + 4, 1, 1);
	ctx.fillRect(x*8 + 7, y*12 + 3, 1, 1);

	//legs
	ctx.fillRect(x*8 + 2, y*12 + 8, 4, 1);
	ctx.fillRect(x*8 + 1, y*12 + 9, 1, 1);
	ctx.fillRect(x*8, y*12 + 8, 1, 3);
	ctx.fillRect(x*8 + 6, y*12 + 9, 1, 1);
	ctx.fillRect(x*8 + 7, y*12 + 8, 1, 3);
	*/

	ctx.drawImage(frogImage, x*8, y*12);
}

//cars
function drawCars()
{
	ctx.fillStyle = 'yellow';
	//lane 1
	for(var i = 2; i < car1.length; i++)
	{
		//if(car1[i]) ctx.fillRect((i-2)*8, 85, 8, 11);
		if(car1[i]) ctx.drawImage(car1Image, (i-2)*8, 84);
	}

	//lane 2
	for(var i = 0; i < car2.length; i++)
	{
		//if(car2[i]) ctx.fillRect(i*8, 73, 8, 11);
		if(car2[i]) ctx.drawImage(car2Image, i*8, 72);
	}

	//lane 3 THIS WILL CHANGE WITH DIFFERENT DRAWINGS
	for(var i = 1; i < car1.length-1; i++)
	{
		//if(car3[i]) ctx.fillRect((i-2)*8, 61, 8, 11);
		if(car3[i] && !car3[i-1]) ctx.drawImage(car3Image, (i-2)*8, 60);
	}


}

//display water
function drawWater()
{
	ctx.fillStyle = 'brown';
	//lane 1
	for(var i = 2; i < water1.length; i++)
	{
		if(water1[i]) ctx.fillRect((i-2)*8, 37, 8, 11);
	}

	//lane 2
	for(var i = 0; i < water2.length; i++)
	{
		if(water2[i]) ctx.fillRect(i*8, 25, 8, 11);
	}

	//lane 3 THIS WILL CHANGE WITH DIFFERENT DRAWINGS
	for(var i = 2; i < water1.length; i++)
	{
		if(water3[i]) ctx.fillRect((i-2)*8, 13, 8, 11);
	}
}

//display for score and remaining time
function timeScore()
{
	ctx.fillStyle = 'black';

	//side bars
	ctx.fillRect(0, 109, 2, 10);
	ctx.fillRect(62, 109, 2, 10);

	//percent of bar to fill
	let ratio = time / maxTime;
	ctx.fillRect(4, 111, Math.round(ratio * 56), 4);

	ctx.font = '10px Silkscreen';
	ctx.fillText(score + ' HI: ' + highScore, 0, 128);
}

function keyDownHandler(e)
{
	if(e.key == 'Up' || e.key == 'ArrowUp' || e.key == 'w') y-=1;
	else if(e.key == 'Down' || e.key == 'ArrowDown' || e.key == 's') y+=1;
	else if(e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') x-=1;
	else if(e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') x+=1;

	if(x > 7) x = 7;
	else if(x < 0) x = 0;
	if(y > 8) y = 8;
	else if(y < 0) y = 0;

	//if dead, respawn
	if(endScreen) respawn();
}