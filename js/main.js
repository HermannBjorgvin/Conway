var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

function gameTick(){
	if (game.paused != true) {
		drawChunks();
		nextGeneration();
	};
}

// Basic settings object that i can reference later
var game = {
	speed: 50,
	paused: false,
	zoom: 2,
	chunkSize: 24,
	mapSizeTop: 0,
	mapSizeBottom: 7,
	mapSizeLeft: 0,
	mapSizeRight: 20
}

// This is the camera object
var camera = {
	offsetX:0, // offsets in pixels that change with zoom 
	offsetY:0,
	oldOffsetX:0,
	oldOffsetY:0,
	lockCamera:true,
	mouseStartPosX:0,
	mouseStartPosY:0,
	mouseDown: function(e){ // on mousedown lock down coordinates and mouse start position
		camera.lockCamera = false;
		camera.oldOffsetX = camera.offsetX;
		camera.oldOffsetY = camera.offsetY;
		camera.mouseStartPosX = e.x;
		camera.mouseStartPosY = e.y;
		console.log("mouseDown X:"+e.x+" Y:"+e.y);
	},
	mouseUp: function(){
		camera.lockCamera = true;
		console.log("mouseUp");
	},
	mouseMove: function(e){
		if (camera.lockCamera != true) {
			//camera.offsetX = camera.oldOffsetX + (0 - camera.mouseStartPosX);
			camera.offsetY = camera.oldOffsetY + (e.y - camera.mouseStartPosY);
			//console.log(" X:"+ String(camera.offsetX));
			console.log(" Y:"+ String(camera.offsetY));
		};
	}
}

canvas.addEventListener("mousedown", camera.mouseDown, false);
canvas.addEventListener("mouseup", camera.mouseUp, false);
canvas.addEventListener("mousemove", camera.mouseMove, false);

// This is the paintbrush
var paintbrush = {
	size: 1,
	spread: 0,
}

// This is where i store my cellData
var chunks = [
	{
		active:1,
		suspended:0,
		x: 2,
		y: 2,
		cells:[
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}]
		]
	},
	{
		active:1,
		suspended:0,
		x: 3,
		y: 2,
		cells:[
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}]
		]
	},
	{
		active:1,
		suspended:0,
		x: 3,
		y: 6,
		cells:[
			[{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 1, k: 1},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 1, k: 1}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 1, k: 1},{a: 1, k: 1},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 1, k: 1},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
			[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}]
		]
	}
];

// Main interval function
setInterval(function(){gameTick();},game.speed);

// Chunk constructor
function newChunk(x, y, active, suspended){
	this.active = active;
	this.suspended = suspended;
	this.x = x;
	this.y = y;
	this.cells = [
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}]
	]
}

// Calculator for the chunks and cells
function nextGeneration(){

	// Deletes unused chunks
	deleteEmptyChunks();

	// Generates new chunks where needed
	generateNewChunks();

	// Qualify cells (Keep or Kill)
	for (var i = chunks.length - 1; i >= 0; i--) {
		if (chunks[i].active == 1) {

			var chunk = chunks[i];
			var cells = chunks[i].cells;

			// for all the cells in the chunk
			for (var y = cells.length - 1; y >= 0; y--) {
				for (var x = cells[y].length - 1; x >= 0; x--) {

					var cell = cells[y][x];
					var neighbors = 0;
					var bounds = game.chunkSize-1;

					// Top and Top Right neighbors
					if (y != 0) {
						//top block
						if (chunk.cells[y-1][x].a == 1) {
							neighbors++;
						};

						// right block
						if (x != bounds) {
							if (chunk.cells[y-1][x+1].a == 1) {
								neighbors++;
							};
						}
						else if(x == bounds) {	
							var rightChunk = _.findWhere(chunks, {x: chunk.x+1, y: chunk.y});

							if (rightChunk != undefined && rightChunk.cells[y-1][0].a == 1) {
								neighbors++;
							};
						};
					}
					else if (y == 0) {
						var topChunk = _.findWhere(chunks, {x: chunk.x, y: chunk.y-1});

						//top block
						if (topChunk != undefined && topChunk.cells[bounds][x].a == 1) {
							neighbors++;
						};

						//top right block
						if (x != bounds) {
							if (topChunk != undefined && topChunk.cells[bounds][x+1].a == 1) {
								neighbors++;
							};
						}
						else if(topChunk != undefined && x == bounds) {	
							var topRightChunk = _.findWhere(chunks, {x: topChunk.x+1, y: topChunk.y});

							if (topRightChunk != undefined && topRightChunk.cells[bounds][0].a == 1) {
								neighbors++;
							};
						};
					};

					// Bottom and Bottom Left neighbors
					if (y != bounds && neighbors <4) {
						//bottom block
						if (chunk.cells[y+1][x].a == 1) {
							neighbors++;
						};

						// bottom Left block
						if (x != 0) {
							if (chunk.cells[y+1][x-1].a == 1) {
								neighbors++;
							};
						}
						else if(x == 0 && neighbors <4) {	
							var leftChunk = _.findWhere(chunks, {x: chunk.x-1, y: chunk.y});
							
							if (leftChunk != undefined && leftChunk.cells[y+1][bounds].a == 1) {
								neighbors++;
							};
						};
					}
					else if (y == bounds) {
						var bottomChunk = _.findWhere(chunks, {x: chunk.x, y: chunk.y+1});

						//bottom block
						if (bottomChunk != undefined && bottomChunk.cells[0][x].a == 1) {
							neighbors++;
						};

						//bottom left block
						if (x != 0) {
							if (bottomChunk != undefined && bottomChunk.cells[0][x-1].a == 1) {
								neighbors++;
							};
						}
						else if(bottomChunk != undefined && x == 0 && neighbors <4) {	
							var bottomLeftChunk = _.findWhere(chunks, {x: bottomChunk.x-1, y: bottomChunk.y});

							if (bottomLeftChunk != undefined && bottomLeftChunk.cells[0][bounds].a == 1) {
								neighbors++;
							};
						};
					};

					// Left and Left Top neighbors
					if (x != 0 && neighbors <4) {
						// Left block
						if (chunk.cells[y][x-1].a == 1) {
							neighbors++;
						};

						// Left top block
						if (y != 0) {
							if (chunk.cells[y-1][x-1].a == 1) {
								neighbors++;
							};
						}
						else if(y == 0 && neighbors <4) {	
							var leftTopChunk = _.findWhere(chunks, {x: chunk.x, y: chunk.y-1});
							
							if (leftTopChunk != undefined && leftTopChunk.cells[bounds][x-1].a == 1) {
								neighbors++;
							};
						};
					}
					else if (x == 0 && neighbors <4) {
						var leftChunk = _.findWhere(chunks, {x: chunk.x-1, y: chunk.y});

						//left block
						if (leftChunk != undefined && leftChunk.cells[y][bounds].a == 1) {
							neighbors++;
						};

						//left top block
						if (y != 0) {
							if (leftChunk != undefined && leftChunk.cells[y-1][bounds].a == 1) {
								neighbors++;
							};
						}
						else if(y == 0 && neighbors <4) {	
							var leftTopChunk = _.findWhere(chunks, {x: chunk.x-1, y: chunk.y-1});

							if (leftTopChunk != undefined && leftTopChunk.cells[bounds][bounds].a == 1) {
								neighbors++;
							};
						};
					};

					// Right and Right Bottom neighbors
					if (x != bounds && neighbors <4) {
						// Right block
						if (chunk.cells[y][x+1].a == 1) {
							neighbors++;
						};

						// Right Bottom block
						if (y != bounds) {
							if (chunk.cells[y+1][x+1].a == 1) {
								neighbors++;
							};
						}
						else if(y == bounds && neighbors <4) {	
							var rightBottomChunk = _.findWhere(chunks, {x: chunk.x, y: chunk.y+1});
							
							if (rightBottomChunk != undefined && rightBottomChunk.cells[0][x+1].a == 1) {
								neighbors++;
							};
						};
					}
					else if (x == bounds && neighbors <4) {
						var rightChunk = _.findWhere(chunks, {x: chunk.x+1, y: chunk.y});

						//right block
						if (rightChunk != undefined && rightChunk.cells[y][0].a == 1) {
							neighbors++;
						};

						//right bottom block
						if (y != bounds) {
							if (rightChunk != undefined && rightChunk.cells[y+1][0].a == 1) {
								neighbors++;
							};
						}
						else if(y == bounds && neighbors <4) {	
							var rightBottomChunk = _.findWhere(chunks, {x: chunk.x+1, y: chunk.y+1});

							if (rightBottomChunk != undefined && rightBottomChunk.cells[0][0].a == 1) {
								neighbors++;
							};
						};
					};

					// Decide if I kill or keep the cell
					if (neighbors <= 1 || neighbors >= 4){
						cell.k = 0;
					}
					else if (cell.a == 1 && neighbors <= 3){
						cell.k = 1;
					}
					else if(cell.a == 0 && neighbors == 3){
						cell.k = 1;
					}
				};
			};
		};
	};

	// Kill all cells that didnt qualify
	kill();

}

// Generate the chunks that cells are about to enter into
function generateNewChunks(){
	for (var i = chunks.length - 1; i >= 0; i--) {
		var chunk = chunks[i];

		var leftChunkActive = false;
		var rightChunkActive = false;
		var topChunkActive = false;
		var bottomChunkActive = false;

		for (var z = chunk.cells.length - 1; z >= 0; z--) {	
	
			if (leftChunkActive != true && chunk.cells[z][0].a == 1) 
			{
				leftChunkActive = true;
				activateChunk(chunk.x-1, chunk.y);
			};
			
			if (rightChunkActive != true && chunk.cells[z][game.chunkSize-1].a == 1) 
			{
				rightChunkActive = true;
				activateChunk(chunk.x+1, chunk.y);
			};
			
			if (topChunkActive != true && chunk.cells[0][z].a == 1) 
			{
				topChunkActive = true;
				activateChunk(chunk.x, chunk.y-1);
			};
		
			if (bottomChunkActive != true && chunk.cells[game.chunkSize-1][z].a == 1) 
			{
				bottomChunkActive = true;
				activateChunk(chunk.x, chunk.y+1);
			};
		};
	};
}

// Activate or Generate a new chunks
function activateChunk(x_coords, y_coords){
	var found = false;
	for (var i = chunks.length - 1; i >= 0; i--) {
		if (chunks[i].y == y_coords  && chunks[i].x == x_coords) {
			chunks[i].active = 1;
			found = true;
		};
	};
	if (found === false) {
		var tempNewChunk = new newChunk(x_coords, y_coords, 1, 0);
		chunks.push(tempNewChunk);
	};
}

// Deletes empty chunks
function deleteEmptyChunks(){
	for (var i = chunks.length - 1; i >= 0; i--) {
	
		var c = chunks[i];
		var chunkEmpty = true;
		
		for (var y = c.cells.length - 1; y >= 0; y--) {
			for (var x = c.cells[y].length - 1; x >= 0; x--) {
				if (c.cells[y][x].a == 1 || c.cells[y][x] == 1) {
					chunkEmpty = false;
				};
			};
		};

		if (
			!(c.x >= -game.mapSizeLeft && c.x <= game.mapSizeRight) ||
			!(c.y >= -game.mapSizeTop && c.y <= game.mapSizeBottom)
		) {
			chunks.splice(i,1);
		};

		if (chunkEmpty == true) {
			chunks.splice(i,1);
		};
	};
}

// Kill cells marked k == 0
function kill(){
	for (var i = chunks.length - 1; i >= 0; i--) {
		for (var y = chunks[i].cells.length - 1; y >= 0; y--) {
			for (var z = chunks[i].cells[y].length - 1; z >= 0; z--) {
				cell = chunks[i].cells[y][z];
				if (cell.k == 0){
					cell.a = 0;
				}
				else if(cell.k == 1){
					cell.a = 1;
				}
			};
		};
	};

	killReset();
}

// Reset the .Kill property of a cell
function killReset(){
	for (var i = chunks.length - 1; i >= 0; i--) {
		for (var y = chunks[i].cells.length - 1; y >= 0; y--) {
			for (var z = chunks[i].cells[y].length - 1; z >= 0; z--) {
				cell = chunks[i].cells[y][z];
				if (cell.k == 1){
					cell.k = 0;
				};
			};
		};
	};
}

// Pretty gfx
function drawChunks(){
	clearCanvas();

	ctx.fillStyle = '#B6E2E7';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (var i = chunks.length - 1; i >= 0; i--) {
		drawChunk(chunks[i]);
	};
}

// Draw a specific chunks
function drawChunk(chunk){

	var zoom = game.zoom;

	ctx.fillStyle = '#4BC379';

	// Draw chunk background
	ctx.fillRect(chunk.x * zoom * game.chunkSize + camera.offsetX, chunk.y * zoom * game.chunkSize + camera.offsetY, zoom * game.chunkSize, zoom * game.chunkSize);

	// Draw cells
	for (var y = chunk.cells.length - 1; y >= 0; y--) {
		chunk.cells[y]

		for (var x = chunk.cells[y].length - 1; x >= 0; x--) {
			var cell = chunk.cells[y][x];

			if (cell.a == 1){
				var xCoords = (chunk.x * game.chunkSize + x) * zoom;
				var yCoords = (chunk.y * game.chunkSize + y) * zoom;

				ctx.fillStyle = '#000';
				ctx.fillRect(xCoords + camera.offsetX, yCoords + camera.offsetY, zoom, zoom);
			};
		};
	};
}

// Clear canvas
function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
}