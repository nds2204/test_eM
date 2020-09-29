function main()
{
	class Disk {
		#x = 0;
		#y = 0;
		#radius = 1;
		#color = 'black';

		constructor(x, y, radius, color)
		{
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.color = color;
		}

		draw()
		{
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.closePath();
		}
	}

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var centerDisk = new Disk(canvas.width / 2, canvas.height / 2, 25, 'black');
	
	var redDisk = new Disk(Math.random() * canvas.width, Math.random() * canvas.height, 50, 'red');

	var greenDisk = new Disk(Math.random() * canvas.width, Math.random() * canvas.height, 50, 'green');

	var blueDisk = new Disk(Math.random() * canvas.width, Math.random() * canvas.height, 50, 'blue');

	var handles = [redDisk, greenDisk, blueDisk];

	var dragHandle;

	var offsetX, offsetY;

	function printText(text, color)
	{
		ctx.font = '48px serif';
		ctx.textAlign = 'center';
		ctx.fillStyle = text;
		ctx.fillText(text, canvas.width / 2, canvas.height * 0.1);
	}

	function checkNearest()
	{
		var redDistance = Math.sqrt(Math.pow(Math.abs(centerDisk.x - redDisk.x), 2) + Math.pow(Math.abs(centerDisk.y - redDisk.y), 2));
		var greenDistance = Math.sqrt(Math.pow(Math.abs(centerDisk.x - greenDisk.x), 2) + Math.pow(Math.abs(centerDisk.y - greenDisk.y), 2));
		var blueDistance = Math.sqrt(Math.pow(Math.abs(centerDisk.x - blueDisk.x), 2) + Math.pow(Math.abs(centerDisk.y - blueDisk.y), 2));

		if (redDistance < greenDistance && redDistance < blueDistance)
		{
			printText('Red');
		}
		else if (greenDistance < redDistance && greenDistance < blueDistance)
		{
			printText('Green');
		}
		else if (blueDistance < greenDistance && blueDistance < redDistance)
		{
			printText('Blue');
		}
	}

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		centerDisk.draw();
		redDisk.draw();
		greenDisk.draw();
		blueDisk.draw();
		
		checkNearest();
	}

	function onMouseMove(event)
	{
		dragHandle.x = event.pageX - offsetX;
		dragHandle.y = event.pageY - offsetY;
		draw();
	}

	function onMouseUp(event)
	{
		canvas.removeEventListener('mousemove', onMouseMove);
		canvas.removeEventListener('mouseup', onMouseUp);
	}

	function isCursorWithinCircle(circle, mouseX, mouseY)
	{
    	var distSqr = Math.pow(circle.x - mouseX, 2) + Math.pow(circle.y - mouseY, 2);

    	if(distSqr < circle.radius * circle.radius)
    	{
        	return true;
    	}
    	
    	return false;
	}

	canvas.addEventListener('mousedown', function(event)
	{
		mouseX = event.pageX;
		mouseY = event.pageY;
		
		for(var count = 0; count < 3; count += 1)
		{
			var handle = handles[count];
			if(isCursorWithinCircle(handle, mouseX, mouseY))
			{
				canvas.addEventListener('mousemove', onMouseMove);
				canvas.addEventListener('mouseup', onMouseUp);
				dragHandle = handle;
				offsetX = mouseX - handle.x;
				offsetY = mouseY - handle.y;
			}
		}
	});

	draw();
}