// Delauney Test for Leaf Editor
// © 2019 Philipp Lehmann

// Modes
let numModes = 6;
let drawMode = 0;
let fillMode = 0;
let posRoot = 200;
let posTip = 100;
let clickBorder = 50;

// Leafs
let defaultLeaf;
let currentSelection;
let mouseCanvasX;
let mouseCanvasY;

// Visual
let mirroredDrawing = false;
let img;
let halfHeight, halfWidth;

// Controls
let selectDrawMode;
let selectFillMode;


// Setup 
// ---------------------------------------------------------------------------
function setup() {

	// Setup Canvas
	canvas = createCanvas(1000, 640);
	canvas.parent('canvasWrapper');

	// Leaf
	defaultLeaf = new Leaf();
	defaultLeaf.init();

	// Colors
	colorMode(HSB, 360, 100, 100);
	setColors();

	// Modes
	colorMode(HSB, 360, 100, 100);
	strokeCap(ROUND);
	strokeJoin(ROUND);
	ellipseMode(CENTER);
	rectMode(CENTER);

	// Visual
	halfHeight = height / 2;
	halfWidth = width / 2;

	// Controls
	selectDrawMode = select('#drawMode', '.controls');
	for(var i = 0; i < numModes; i++) {
		selectDrawMode.option(i);
	};
	selectDrawMode.changed(drawModeSelected);

	selectFillMode = select('#fillMode', '.controls');
	selectFillMode.option(0);
	selectFillMode.option(1);
	selectFillMode.changed(fillModeSelected);
}

// Draw 
// ---------------------------------------------------------------------------
function draw() {

	// Mirrored Drawing Mode
	(mouseY > height / 2) ? mirroredDrawing = true: mirroredDrawing = false;
	mouseCanvasX = mouseX;
	mirroredDrawing ? mouseCanvasY = height - mouseY : mouseCanvasY = mouseY;

	// Draw Leaf
	background(255);
	currentSelection = null;
	defaultLeaf.draw();

	// Draw Mirror Image
	drawMirrorImage()
}


// Form Events
// ---------------------------------------------------------------------------
function drawModeSelected() {
	 console.log("Draw Mode:", selectDrawMode.value());
	 drawMode = parseInt(selectDrawMode.value());
	 defaultLeaf.update();
}
function fillModeSelected() {
	 console.log("Fill Mode:", selectFillMode.value());
	 fillMode = parseInt(selectFillMode.value());
	 defaultLeaf.update();
}

// Mouse Events
// ---------------------------------------------------------------------------
function mouseClicked() {
	// Add and remove points.
	if (currentSelection) {
		// If hovering a point, remove it
		defaultLeaf.points.splice(currentSelection, 1);
		defaultLeaf.update();
	} else {

		if (checkClickBorder()) {

			// Mouse position for new point
			var x = mouseCanvasX;
			var y = mouseCanvasY;

			// Snap to mirror line
			(height / 2 - y < 8) ? y = height / 2: 0;

			defaultLeaf.points.push(createVector(x, y));
			defaultLeaf.update();
		}
	}
}

// Key Events
// ---------------------------------------------------------------------------

function keyPressed() {

	// Switch drawing modes
	switch (keyCode) {
		case 38:
			// Key Up
			drawMode = min(drawMode + 1, numModes);
			console.log("Mode", drawMode);
			break;

		case 40:
			// Key 0
			drawMode = max(drawMode - 1, 0);
			console.log("Mode", drawMode);
			break;

		default:
			// console.log(keyCode);
			break;
	}
	defaultLeaf.update();
}

function keyReleased() {
	if (key == 's' || key == 'S') saveCanvas("leaf-" + Math.floor(Date.now() / 1000), 'png');
}


// Visual
// ---------------------------------------------------------------------------
function drawMirrorImage() {
	let mirror = get(0, 0, width, height / 2);
	translate(0, height)
	scale(1, -1);
	image(mirror, 0, 0);
}

function checkClickBorder() {
	return (mouseX > clickBorder && mouseX < width - clickBorder && mouseY > clickBorder && mouseY < height - clickBorder)
}