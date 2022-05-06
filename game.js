const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const framerate = 1000.0/(50.0); //change the denom to whatever framerate you want

document.addEventListener("keydown", keyDownHandler, false);
//document.addEventListener("keyup", keyUpHandler, false);

const maxTime = 100; //int
let time = maxTime; //int

let x = 4; y = 8; //int

//8x9 grid, grid squares are 8x12 pixels

function draw()
{
	//clears canvas each frame before drawing
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	/*
	//this is temp, but there are 3 lanes of cars, one safe lane in between, then 3 lanes of water, last and first lane are goal and starting point respectively.
	for(var i = 0; i < 9; i++)
	{
		//every other stripe is a different colour
		if(i % 2 == 0) ctx.fillStyle = 'green';
		else ctx.fillStyle = 'blue';

		ctx.fillRect(0, i * 12, 64, 12);
	}
	*/

	time--;
	if (time == 0) time = maxTime;

	background();
	frog();
	timeScore();
	
}
setInterval(draw, framerate);

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
	ctx.fillText('100 HI: 150', 0, 128);
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
}

/*
function keyUpHandler(e)
{	
	if(e.key == 'Up' || e.key == 'ArrowUp' || e.key == 'w') input.up = false;
	else if(e.key == 'Down' || e.key == 'ArrowDown' || e.key == 's') input.down = false;
	else if(e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') input.left = false;
	else if(e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') input.right = false;
}
*/