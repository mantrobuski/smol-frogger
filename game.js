const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const framerate = 1000.0/(50.0); //change the denom to whatever framerate you want

document.addEventListener("keydown", keyDownHandler, false);
//document.addEventListener("keyup", keyUpHandler, false);

const maxTime = 1000; //int
let time; //int
let framecount;
let endScreen;
let score;
let highScore = 50;

let x = 4; y = 8; //int
let farthestY;

//these are seperate and not 2D arrays cause they move at different speeds and the middle slice is different from  the edge ones
let car1 = [], car2 = [], car3 = []; //bool
let water1 = [], water2 = [], water3 = []; //bool

//bigger is actually slower
let vcar1 = 17; vcar2 = 13; vcar3 = 10; //int

//8x9 grid, grid squares are 8x12 pixels

//start game
initialize();

//sets the game to random setup initially
function initialize()
{
	framecount = 0;
	time = maxTime;
	endScreen = false;
	score = 0;
	farthestY = 0;

	x = 4; y = 8;


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

	//for....
}

function draw()
{
	//clears canvas each frame before drawing
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(endScreen)
	{
		


		
		background();
		drawCars();
		timeScore();
		//drawWater();
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

	if((8 - y) > farthestY)
	{
		score += 10;
		farthestY = 8 - y;
	}

	time--;
	if (time == 0) time = maxTime;

	background();
	drawCars();
	frog();
	timeScore();
	
}
setInterval(draw, framerate);


//sees if frog should die
function checkDeath()
{
	let dead = false;

	//cars
	if(y >= 5 && y <= 7)
	{
		//x+2 because of off screen car padding
		if(y == 5 && car3[x]) dead = true;
	
		else if(y == 6 && car2[x]) dead = true;

		else if(y == 7 && car1[x]) dead = true;
	}

	//don't check rest of function if already dead, doesn't matter
	if(dead) death();

	else
	{

	}
	
}

//frog ded :(
function death()
{
	endScreen = true;


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


//drawing the background
function background()
{
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
}

//drawing frog
function frog()
{
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
	
}

//cars
function drawCars()
{
	//pad one pixel on the y axis

	ctx.fillStyle = 'yellow';
	//lane 1
	for(var i = 0; i < car1.length; i++)
	{
		if(car1[i]) ctx.fillRect(i*8, 85, 8, 11);
	}

	//lane 2
	for(var i = 0; i < car2.length; i++)
	{
		if(car2[i]) ctx.fillRect(i*8, 73, 8, 11);
	}

	//lane 3 THIS WILL CHANGE WITH DIFFERENT DRAWINGS
	for(var i = 0; i < car1.length; i++)
	{
		if(car3[i]) ctx.fillRect(i*8, 61, 8, 11);
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
	else if(e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') x-=2;
	else if(e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') x+=2;

	if(x > 7) x = 7;
	else if(x < 0) x = 0;
	if(y > 8) y = 8;
	else if(y < 0) y = 0;

	if(endScreen) initialize();
}