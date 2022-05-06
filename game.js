const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const framerate = 1000.0/(50.0); //change the denom to whatever framerate you want

//document.addEventListener("keydown", keyDownHandler, false);
//document.addEventListener("keyup", keyUpHandler, false);

const maxTime = 100;
let time = maxTime;

function draw()
{
	//clears canvas each frame before drawing
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//this is temp, but there are 3 lanes of cars, one safe lane in between, then 3 lanes of water, last and first lane are goal and starting point respectively.
	for(var i = 0; i < 9; i++)
	{
		//every other stripe is a different colour
		if(i % 2 == 0) ctx.fillStyle = 'green';
		else ctx.fillStyle = 'blue';

		ctx.fillRect(0, i * 12, 64, 12);
	}

	ctx.fillStyle = 'black';

	//side bars
	ctx.fillRect(0, 109, 2, 10);
	ctx.fillRect(62, 109, 2, 10);

	//percent of bar to fill
	let ratio = time / maxTime;
	ctx.fillRect(4, 111, Math.round(ratio * 56), 4)

	ctx.font = '10px Silkscreen';
	ctx.fillText('100 HI: 150', 0, 128);

	time--;
	if (time == 0) time = maxTime;

	
}
setInterval(draw, framerate);

/*
function keyDownHandler(e)
{
	if(e.key == 'Up' || e.key == 'ArrowUp' || e.key == 'w') input.up = true;
	else if(e.key == 'Down' || e.key == 'ArrowDown' || e.key == 's') input.down = true;
	else if(e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') input.left = true;
	else if(e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') input.right = true;
	
	//ignore upcoming if the input hasn't changed since last time
	if(inputEquals(input, lastInput)) return;

	if(e.key == 'Up' || e.key == 'ArrowUp' || e.key == 'w') control = 0;
	else if(e.key == 'Down' || e.key == 'ArrowDown' || e.key == 's') control = 1;
	else if(e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') control = 2;
	else if(e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') control = 3;
	
	//shallow copy of input object
	lastInput = {...input};

	//console.log(control, e.key);
}

function keyUpHandler(e)
{
	//this is so that if you're holding two keys and let go of one it will keep the direction of the remaining key
	
	if(e.key == 'Up' || e.key == 'ArrowUp' || e.key == 'w') input.up = false;
	else if(e.key == 'Down' || e.key == 'ArrowDown' || e.key == 's') input.down = false;
	else if(e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') input.left = false;
	else if(e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') input.right = false;

	//ignore upcoming if the input hasn't changed since last time
	if(inputEquals(input, lastInput)) return;

	if(input.up) control = 0;
	else if(input.down) control = 1;
	else if(input.left) control = 2;
	else if(input.right) control = 3;
	//else do nothing and keep control where it is

	//shallow copy of input object
	lastInput = {...input};

	//console.log(control);
}
*/