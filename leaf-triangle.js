function LeafTriangle(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;

    this.draw = function () {

        switch (drawMode) {
            case 0:
                setStyle(null, greens[2], 3);
                this.regularTriangle();
                this.inCircle();
                break;
            case 3:
                // Combined Triangle & Blobs
                setStyle(greens[2]);
                this.regularTriangle();
                setStyle(255);
                (fillMode) ? setStyle(greens[0]) : setStyle(255);
                this.blobbyTriangle(0.65);
                break;
            case 5:
                // Combined Triangle & Blobs
                (fillMode) ? setStyle(greens[0], greens[2], 3) : setStyle(255, greens[2], 3);
                this.inCircle(0.8);
                break;
            default:
                break;
        }
    }

    // Filling shapes
    // ---------------------------------------------------------------------------

    // Regular Triangle
    this.regularTriangle = function () {
        triangle(this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y);
    }

    // Blobby Triangle
    this.blobbyTriangle = function (offset = 0.65) {
        let center = this.centroid();
        let eA = p5.Vector.lerp(center, this.a, offset);
        let eB = p5.Vector.lerp(center, this.b, offset);
        let eC = p5.Vector.lerp(center, this.c, offset);

        beginShape();
        curveVertex(eA.x, eA.y);
        curveVertex(eB.x, eB.y);
        curveVertex(eC.x, eC.y);
        curveVertex(eA.x, eA.y);
        curveVertex(eB.x, eB.y);
        curveVertex(eC.x, eC.y);
        endShape(CLOSE);
    }

    // Center Point - Draw weighted points bassed on x position
    this.centerGradientDot = function () {
        setStyle(greens[3]);
        this.inCircle(map(this.a.x, 0, width, 0.8, 0));
    }

    // Incircle - Draws incircle
    this.inCircle = function (f = 1) {
        let center = this.incircCenter()
        let radius = this.incircRadius() * f;
        ellipse(center.x, center.y, radius, radius);
    }

    // Circumcircle Calculations - Draws circumcircle
    this.circumCircle = function () {
        let center = this.circumCenter()
        let radius = this.circumRadius();
        ellipse(center.x, center.y, radius, radius);
    }


    // Coloring logic
    // ---------------------------------------------------------------------------

    // Area position -> Returns green color
    this.areaPosGreen = function () {
        let center = this.centroid();
        let c = ~~map(center.x, 2 * posRoot, width - 2 * posTip, greens.length - 1, 0, true);
        return greens[c];
    }

    // Area shape -> Returns green color
    this.areaShapeGreen = function () {
        let radius1 = this.circumRadius();
        let radius2 = this.incircRadius();
        let c = constrain(floor(radius1 / radius2) - 2, 0, greens.length - 1);
        return greens[c];
    }

    // Area size -> Returns green color
    this.areaSizeGreen = function () {
        let area = abs(this.a.x * this.b.y + this.b.x * this.c.y + this.c.x * this.a.y - this.a.y * this.b.x - this.b.y * this.c.x - this.c.y * this.a.x) / 2;
        let c = ~~map(area, 0, 10000, 0, greens.length - 1, true);
        return greens[c];
    }

    // Distance to center -> Returns green color
    this.distanceToCenterGreen = function () {
        let center = this.incircCenter();
        let canvasCenter = createVector(halfWidth, halfHeight);
        let c = ~~map(center.dist(canvasCenter), 0, 450, 0, greens.length - 1, true);
        return greens[c];
    }


    // Point calculations
    // ---------------------------------------------------------------------------

    // Incirc center -> Returns vector
    this.incircCenter = function () {
        let a = this.b.dist(this.c)
        let b = this.a.dist(this.c)
        let c = this.a.dist(this.b)

        let x = (a * this.a.x + b * this.b.x + c * this.c.x) / (a + b + c);
        let y = (a * this.a.y + b * this.b.y + c * this.c.y) / (a + b + c);

        return createVector(x, y);
    }

    // Incirc radius -> Returns vector
    this.incircRadius = function () {
        let a = this.a.dist(this.b)
        let b = this.b.dist(this.c)
        let c = this.a.dist(this.c)

        let s = (a + b + c) / 2;
        let r = sqrt(s * (s - a) * (s - b) * (s - c)) / s * 2;

        return r;
    }

    // Circumcircle center -> Returns vector
    this.circumCenter = function () {
        let d = 2.0 * (this.a.x * (this.b.y - this.c.y) + this.b.x * (this.c.y - this.a.y) + this.c.x * (this.a.y - this.b.y));

        let aa = this.a.x * this.a.x + this.a.y * this.a.y;
        let bb = this.b.x * this.b.x + this.b.y * this.b.y;
        let cc = this.c.x * this.c.x + this.c.y * this.c.y;

        let x = (aa * (this.b.y - this.c.y) + bb * (this.c.y - this.a.y) + cc * (this.a.y - this.b.y)) / d;
        let y = (aa * (this.c.x - this.b.x) + bb * (this.a.x - this.c.x) + cc * (this.b.x - this.a.x)) / d;

        return createVector(x, y);
    }

    // Circumcircle radius -> Returns vector
    this.circumRadius = function () {
        let abx = this.a.x - this.b.x;
        let aby = this.a.y - this.b.y;
        let C = sqrt(abx * abx + aby * aby);

        let bcx = this.b.x - this.c.x;
        let bcy = this.b.y - this.c.y;
        let A = sqrt(bcx * bcx + bcy * bcy);

        let cax = this.c.x - this.a.x;
        let cay = this.c.y - this.a.y;
        let B = sqrt(cax * cax + cay * cay);

        return 2 * (A * B * C) / sqrt((A + B + C) * (B + C - A) * (C + A - B) * (A + B - C));
    }

    // Centroid - Weight point 
    this.centroid = function () {
        let twothird = 2.0 / 3.0;
        let bc = p5.Vector.lerp(this.b, this.c, 0.5);
        return p5.Vector.lerp(this.a, bc, twothird);
    }
}