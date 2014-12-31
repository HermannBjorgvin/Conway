var canvas = document.getElementById("canvas");
canvas.setAttribute("tabindex", 0);
var ctx = canvas.getContext('2d');

// This is where i store my cellData
// A stands for alive, is the cell currently alive?
// K stands for keep, do i want to keep the cell next round?
var chunks = [
	
];

// Basic settings object that i can reference later
var game = {
	speed: 50, 
	paused: true,
	zoom: 2,
	chunkSize: 4, // 24 seems to work best
	mapSizeTop: 100,
	mapSizeBottom: 100,
	mapSizeLeft: 100,
	mapSizeRight: 100,
	currentFPS: [0,0,0,0,0,0,0,0,0,0],
	pause: function(e){
		if (e.key == "p") {
			//console.log("p");
			this.paused = !this.paused;
		};
	},
	nextFrame: function(e){
		if (e.key == "d") {
			console.log("d");
			this.forceTick();
		};
	},
	tick: function(){
		var start = new Date().getTime();

		if (game.paused != true) {
			nextGeneration();
		}
		draw();
	
		var end = new Date().getTime();
		var time = end - start;

		if (game.paused != true) {
			this.currentFPS.push(Math.round(1000/time));
			this.currentFPS.splice(0, 1);
		};
	},
	forceTick: function(){
		nextGeneration();
		draw();
	},
	getMousePos: function(canvas, evt) {
	    var rect = canvas.getBoundingClientRect();
	    return {
	    	x: Math.round(evt.clientX - rect.left),
	    	y: Math.round(evt.clientY - rect.top)
	    };
	}
}

// Game event listeners
canvas.addEventListener("keydown", game.pause.bind(game), false);
canvas.addEventListener("keydown", game.nextFrame.bind(game), false);

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
	    if (e.button === 2) {
	    	//console.log("Right mouse down on x:"+e.screenX+" y:"+e.screenY);
		    this.lockCamera = false;
		    this.oldOffsetX = this.offsetX;
		    this.oldOffsetY = this.offsetY;
		    this.mouseStartPosX = e.screenX;
		    this.mouseStartPosY = e.screenY;    	
	    };
	},
	mouseUp: function(e){ // on mouseup lock the camera (so that the mousemove event isnt just all over the place)
	    if (e.button === 2) {
	    	//console.log("Right Mouse up");
	    	this.lockCamera = true;
	    }
	},
	mouseMove: function(e){
		if (this.lockCamera != true) {
	   		//console.log("Mouse move");
		    this.offsetX = this.oldOffsetX + (e.screenX - this.mouseStartPosX);
		    this.offsetY = this.oldOffsetY + (e.screenY - this.mouseStartPosY);
		};
	},
	mouseWheel: function(e){
	 	e.preventDefault();
		//console.log(e.deltaY);
		
		var pos = game.getMousePos(canvas, e);
		var zoomDelta = Math.abs(Math.ceil(e.deltaY/3));

		//console.log("X "+pos.x);
		//console.log("Y "+pos.y);

		if (e.deltaY < 0) {
			// Change the zoom
			game.zoom += zoomDelta;
		}
		else if(e.deltaY > 0){
			// Change the zoom
			game.zoom = Math.max(game.zoom - zoomDelta, 1);
		}
		else{};

		// Change the camera offset to match the zoom
		this.offsetX = (this.offsetX / game.zoom) * game.zoom;
		this.offsetY = (this.offsetY / game.zoom) * game.zoom;

	}	
}

// Event listeners for camera 
canvas.addEventListener("mousedown", camera.mouseDown.bind(camera), false);
canvas.addEventListener("mouseup", camera.mouseUp.bind(camera), false);
canvas.addEventListener("mousemove", camera.mouseMove.bind(camera), false);
canvas.addEventListener("wheel", camera.mouseWheel.bind(camera), false);

// This is the paintbrush
var paintbrush = {
	size: 1, // size of the brush
	spread: 0, // random spread of the paint
	lock: true, // idr this one
	mouseDown: function(e){
		if (e.button === 0) {
			this.lock = false;
			this.paintCell(e);
		}
	},
	mouseUp: function(e){
		if (e.button === 0) {
			this.lock = true;
		}
	},
	mouseMove: function(e){
		if (this.lock != true) {
			this.paintCell(e);
		};
	},
	paintCell: function(e){ // Split this shit up way better, have a function that just paints one cell by coords
		var pos = game.getMousePos(canvas, e);
		var chunk = {x:0, y:0};
		var cell = {x:0, y:0};

		chunk.x = Math.floor(
			(pos.x - camera.offsetX)/(game.chunkSize * game.zoom)
		);
		chunk.y = Math.floor(
			(pos.y - camera.offsetY)/(game.chunkSize * game.zoom)
		);

		cell.x = Math.floor(
			((pos.x - camera.offsetX)%(game.chunkSize * game.zoom)) / game.zoom
		);
		cell.y = Math.floor(
			((pos.y - camera.offsetY)%(game.chunkSize * game.zoom)) / game.zoom
		);

		// if the cell coords are below zero
		if (cell.y < 0) {cell.y = game.chunkSize + cell.y};
		if (cell.x < 0) {cell.x = game.chunkSize + cell.x};

		//console.log("Chunk x:"+chunk.x+" y:"+chunk.y);
		//console.log("Cell  x:"+cell.x+" y:"+cell.y);

		this.newCell(chunk, cell);	
	},
	newCell: function(chunk, cell){
		var chunkFound = false;

		for (var z = 0; z < chunks.length; z++) {
			if (chunks[z].x == chunk.x && chunks[z].y == chunk.y) {
				chunkFound = true;

				chunks[z].cells[cell.y][cell.x].a = 1;
				chunks[z].cells[cell.y][cell.x].k = 0;
			};
		};

		if (chunkFound != true) {
			var tempChunk = new newChunk(chunk.x, chunk.y, 1, 0);
			chunks.push(tempChunk);
			this.newCell(chunk, cell);
		};
	}
}

// Mouse event listeners for paintbrush
canvas.addEventListener("mousedown", paintbrush.mouseDown.bind(paintbrush), false);
canvas.addEventListener("mouseup", paintbrush.mouseUp.bind(paintbrush), false);
canvas.addEventListener("mousemove", paintbrush.mouseMove.bind(paintbrush), false);

// Main interval function
setInterval(function(){game.tick();},game.speed);

function findChunk(chunksArr, coords){
	for (var i = chunks.length - 1; i >= 0; i--) {
		if(
			chunks[i].x == coords.x &&
			chunks[i].y == coords.y		
		){
			return chunks[i];
		}
	};
}

// Chunk constructor
function newChunk(x, y, active, suspended){
	var tempChunk = [];
	var emptyCell = {a: 0, k: 0};

	for (var i = 0; i < game.chunkSize.length; i++) {
		//game.chunkSize[i]
		var tempRow = [];

		for (var z = 0; z < game.chunkSize.length; z++) {
			tempRow.push(emptyCell);
		};

		tempChunk.push(tempRow);
	};

	tempChunk = [
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}],
		[{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0},{a: 0, k: 0}]
	];

	this.active = active;
	this.suspended = suspended;
	this.x = x;
	this.y = y;
	this.cells = tempChunk;
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

			/*
			* Maybe change this so that we look on the edges first and then inside the chunk
			* 
			*
			*
			*/

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
							var rightChunk = findChunk(chunks, {x: chunk.x+1, y: chunk.y});

							if (rightChunk != undefined && rightChunk.cells[y-1][0].a == 1) {
								neighbors++;
							};
						};
					}
					else if (y == 0) {
						var topChunk = findChunk(chunks, {x: chunk.x, y: chunk.y-1});

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
							var topRightChunk = findChunk(chunks, {x: topChunk.x+1, y: topChunk.y});

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
							var leftChunk = findChunk(chunks, {x: chunk.x-1, y: chunk.y});
							
							if (leftChunk != undefined && leftChunk.cells[y+1][bounds].a == 1) {
								neighbors++;
							};
						};
					}
					else if (y == bounds) {
						var bottomChunk = findChunk(chunks, {x: chunk.x, y: chunk.y+1});

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
							var bottomLeftChunk = findChunk(chunks, {x: bottomChunk.x-1, y: bottomChunk.y});

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
							var leftTopChunk = findChunk(chunks, {x: chunk.x, y: chunk.y-1});
							
							if (leftTopChunk != undefined && leftTopChunk.cells[bounds][x-1].a == 1) {
								neighbors++;
							};
						};
					}
					else if (x == 0 && neighbors <4) {
						var leftChunk = findChunk(chunks, {x: chunk.x-1, y: chunk.y});

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
							var leftTopChunk = findChunk(chunks, {x: chunk.x-1, y: chunk.y-1});

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
							var rightBottomChunk = findChunk(chunks, {x: chunk.x, y: chunk.y+1});
							
							if (rightBottomChunk != undefined && rightBottomChunk.cells[0][x+1].a == 1) {
								neighbors++;
							};
						};
					}
					else if (x == bounds && neighbors <4) {
						var rightChunk = findChunk(chunks, {x: chunk.x+1, y: chunk.y});

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
							var rightBottomChunk = findChunk(chunks, {x: chunk.x+1, y: chunk.y+1});

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

// Generate the chunks that cells are about to enter into - OPTIMIZED!
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
function draw(){
	clearCanvas();

	ctx.fillStyle = '#B6E2E7';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (var i = chunks.length - 1; i >= 0; i--) {
		drawChunk(chunks[i]);
	};

	var sum = game.currentFPS.reduce(function(a, b) { return a + b });
	var avg = sum / game.currentFPS.length;

	ctx.fillStyle = '#000';
	ctx.fillText('FPS:'+avg,10,10);

	document.getElementById("title").innerHTML = "Conway, fps:"+avg;
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