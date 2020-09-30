function main()
{
	//	Ecriture d'une classe disque, pour simplifer le travail
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

		//	Methode pour dessiner le disque
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

	//	Creation du disque central noir
	var centerDisk = new Disk(canvas.width / 2, canvas.height / 2, 25, 'black');
	
	//	Creation du disque rouge
	var redDisk = new Disk(Math.random() * canvas.width, Math.random() * canvas.height, 50, 'red');

	//	Creation du disque vert
	var greenDisk = new Disk(Math.random() * canvas.width, Math.random() * canvas.height, 50, 'green');

	//	Creation du disque bleu
	var blueDisk = new Disk(Math.random() * canvas.width, Math.random() * canvas.height, 50, 'blue');

	//	Creation du tableau selecteur, répertoriant les disques potentiellement selectionnables
	var handles = [redDisk, greenDisk, blueDisk];

	//	Creation varible du disque selectionné (servant de pointeur)
	var dragHandle;

	//	Variables de décalage pour la synchro pointeur de souris avec l'objet disque
	var offsetX, offsetY;

	//	Fonction de dessin du texte du disque le plus proche 
	function printText(text)
	{
		ctx.font = '48px serif';
		ctx.textAlign = 'center';
		ctx.fillStyle = text;
		ctx.fillText(text, canvas.width / 2, canvas.height * 0.1);
	}

	//	Fonction qui vérifie quel est le disque le plus proche du disque central
	function checkNearest()
	{
		//	Calcul théorème de pythagore sans la racine carrée pour alléger le calcul : distance = (xA - xB)^2 + (yA - yB)^2	
		var redDistance = Math.pow(centerDisk.x - redDisk.x, 2) + Math.pow(centerDisk.y - redDisk.y, 2);
		var greenDistance = Math.pow(centerDisk.x - greenDisk.x, 2) + Math.pow(centerDisk.y - greenDisk.y, 2);
		var blueDistance = Math.pow(centerDisk.x - blueDisk.x, 2) + Math.pow(centerDisk.y - blueDisk.y, 2);

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

	//	Fonction de dessin entier, efface et dessine la frame à chaque appel de la fct
	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		centerDisk.draw();
		redDisk.draw();
		greenDisk.draw();
		blueDisk.draw();
		
		checkNearest();
	}

	//	Fct de déplacement du disque handled par le mouvement de la souris (appelée lors d'un clic sur un disque), on redessine à chaque déplacement
	function onMouseMove(event)
	{
		dragHandle.x = event.pageX - offsetX;
		dragHandle.y = event.pageY - offsetY;
		draw();
	}

	//	Fct pour retirer les eventlistener sur le relachement du clic( lache le disque et arrete de le déplacer)
	function onMouseUp(event)
	{
		canvas.removeEventListener('mousemove', onMouseMove);
		canvas.removeEventListener('mouseup', onMouseUp);
	}

	//	Fct qui détermine si la souris est sur un disque ou non
	function isCursorWithinCircle(circle, mouseX, mouseY)
	{
    		var distSqr = Math.pow(circle.x - mouseX, 2) + Math.pow(circle.y - mouseY, 2);

    		if(distSqr < Math.pow(circle.radius, 2))
    		{
        		return true;
    		}
    	
    		return false;
	}

	//	Fct de détection du clic
	canvas.addEventListener('mousedown', function(event)
	{
		mouseX = event.pageX;
		mouseY = event.pageY;
		
		//	On teste si un disque a été cliqué, sur une correponsdance on déplace le disque jusqu'à ce que le clic soit relaché
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
