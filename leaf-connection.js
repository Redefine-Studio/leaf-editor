function LeafConnection(a, b) {
    this.leaf = null;
    this.a = a;
    this.b = b;
    this.border = false;
    this.distance = this.a.dist(this.b);
    this.center = p5.Vector.lerp(this.a, this.b, 0.5);


    this.init = function (leaf) {
        this.leaf = leaf;
        this.border = checkHull(this.leaf.hullNodes, this.a, this.b);
    }

    this.draw = function () {

        switch (drawMode) {
            case 1:
                // Directional weighted lines
                setStyle(null, greens[2], 3);
                this.directionWeightLine();
                break;          
            default:
                break;
        }
    }

    // Hover State
    // ---------------------------------------------------------------------------
    this.drawHoverState = function () {
        // Hover State
        if (checkClickBorder()) {
            setStyle(null, 255, 1);
            this.regularLine();
        }
    }

    // Connection shapes
    // ---------------------------------------------------------------------------

    // Regular line
    this.regularLine = function () {
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }

    // Weighted - Lines based on direction of their heading
    this.directionWeightLine = function () {
        // Values
        let h1 = createVector(this.a.x - this.b.x, this.a.y - this.b.y).heading();
        let h2 = createVector(this.b.x - this.a.x, this.b.y - this.a.y).heading();
        let heading = max(h1, h2);
        let w = map(abs(heading), 0, PI, 2, 8, true) * 1;

        // Draw
        strokeWeight(w);
        this.regularLine();
    }

    // Dotted lines - with a minimal distance
    this.dottedLine = function (s = 15) {
        // Values
        let size = s;
        let num = this.distance / size;
        noiseSeed(this.a.x);

        // Draw
        for (var i = 0; i < num; i++) {

            let r = noise(i) * size + 1
            let step = 1 / num;
            let interPoint = p5.Vector.lerp(this.a, this.b, i * step);

            ellipse(interPoint.x, interPoint.y, r, r);
        };
    }

    // Arc - Draw connection with arced lines
    this.drawArcLine = function (s = 5) {
        // Set arc size
        let size = s;
        let fraction = 1 / ceil(this.distance / size);
        let dist = this.distance * fraction;
        let heading = createVector(this.a.x - this.b.x, this.a.y - this.b.y);

        // Draw arced line
        push()
        translate(this.b);
        rotate(heading.heading());

        for (var i = 0; i < 1 / fraction - 1; i++) {
            // Toggle between inner and outer arc
            if (i % 2) {
                arc(dist, 0, dist, dist, 0, -PI);
            } else {
                arc(dist, 0, dist, dist, PI, 0);
            }
            translate(dist, 0);
        };
        pop();
    }
}