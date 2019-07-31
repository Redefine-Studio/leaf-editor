// Delauney Triangulation Methods for leafs


function randomTriangulation() {
	points = [];

	// Push center line for the leaf
	for (var i = 0; i < 5; i++) {
		var x = map(i, 0, 4, posRoot, width - posTip);
		var y = height / 2;
		points.push(createVector(x, y));
	};

	// Create some random points
	for (var i = 0; i < 3; i++) {
		points.push(createVector(~~random(posRoot, width - posTip), ~~random(height / 5, height / 2)));
	}

	return points;
}

function initializeTriangulation(points) {
	// Let's use the Delaunator
	const delaunay = Delaunator.from(points.map(function (pt) {
		return [pt.x, pt.y];
	}));

	// Create Triangle and Connection objects using indices returned by Delaunay.triangulate
	let nodes = [];
	let hullNodes = [];
	let triangles = [];
	let connections = [];

	// Assign Points
	for (var i = 0; i < points.length; i++) {
		nodes.push(new LeafNode(
			i, points[i]
		))
	}

	// Assign Hull
	for (var i = 0; i < delaunay.hull.length; i++) {
		// console.log( points[delaunay.hull[i]] )
		hullNodes.push(points[delaunay.hull[i]]);
	}

	// Assign Triangles and Connections
	for (var i = 0; i < delaunay.triangles.length; i += 3) {

		// Add new triangles to array
		triangles.push(new LeafTriangle(
			points[delaunay.triangles[i]],
			points[delaunay.triangles[i + 1]],
			points[delaunay.triangles[i + 2]]
		));

		// Add all connections to array (1-2, 1-3, 2-3)
		connections.push(new LeafConnection(
			points[delaunay.triangles[i]],
			points[delaunay.triangles[i + 1]]
		));
		connections.push(new LeafConnection(
			points[delaunay.triangles[i]],
			points[delaunay.triangles[i + 2]]
		));
		connections.push(new LeafConnection(
			points[delaunay.triangles[i + 1]],
			points[delaunay.triangles[i + 2]]
		));
	}

	// Clean up connections array
	connections = removeDuplicates(connections)
	return [nodes, hullNodes, connections, triangles]
}

// Remove duplicate objects from an array of similar objects.
function removeDuplicates(arr) {
	arr = arr.filter((obj, index, self) =>
		index === self.findIndex((t) => (
			(t.a === obj.a && t.b === obj.b) || (t.b === obj.a && t.a === obj.b)
		))
	)
	return arr
}

// Check if value exists in array
function checkValue(arr, val) {
	return arr.indexOf(val) > -1;
}

// Check if connection is on hull
function checkHull(arr, a, b) {

	// Check mirrorline and if part of hull
	let b1 = (a.y != height / 2) && (b.y != height / 2)
	let b2 = (arr.indexOf(a) > -1) && (arr.indexOf(b) > -1);

	// Check edges
	if (b.x == posRoot) {
		b1 = true;
	}
	if (a.x == width - posTip) {
		b1 = true
	}

	return b1 && b2

}