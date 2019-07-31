function Leaf() {

    // Datapoints
    this.points = [];
    this.hullNodes = [];
    this.nodes = [];
    this.triangles = [];
    this.connections = [];

    // Objects
    this.hull;

    this.init = function () {
        // Random Random Points
        this.points = randomTriangulation();
        this.update();
    }

    this.update = function () {
        // Get dataobject and assign arrays
        var dataobjects = initializeTriangulation(this.points);
        this.nodes = dataobjects[0];
        this.hullNodes = dataobjects[1];
        this.connections = dataobjects[2];
        this.triangles = dataobjects[3];

        // init connections
        this.connections.forEach(c => c.init(this));

        // init hull
        this.hull = new LeafHull(this);
    }

    this.draw = function () {
        this.hull.draw();
        this.triangles.forEach(t => t.draw());
        this.connections.forEach(c => c.draw());
        this.nodes.forEach(n => n.draw());
    }
}