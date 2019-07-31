function LeafNode(i, a) {
    this.id = i;
    this.a = a;
    this.r = 20;
    this.locked = this.a.x == posRoot || this.a.x == width - posTip;

    this.draw = function () {

        // nodeMode
        switch (drawMode) {
            case 2:
                setStyle(null, greens[2]);
                this.curveRoot();
                break;
            default:
                break;
        }

        this.drawHoverState()
    }

    // Hover State
    // ---------------------------------------------------------------------------
    this.drawHoverState = function () {

        // Hover State
        if (checkClickBorder()) {
            setStyle(1);
            ellipse(this.a.x, this.a.y, 4);
        }

        // Clickable State
        if (dist(mouseCanvasX, mouseCanvasY, this.a.x, this.a.y) < this.r / 2) {
            // Add to Selection
            if (!this.locked) {
                currentSelection = this.id;
            }
            // Draw Node
            setStyle(browns[0]);
            ellipse(this.a.x, this.a.y, this.r);
        }
    }

    // Filling shapes
    // ---------------------------------------------------------------------------

    // Regular ellipse
    this.regularEllipse = function (s = 8) {
        ellipse(this.a.x, this.a.y, s);
    }

    // Root Curve - Draw a line to the root of the leaf
    this.curveRoot = function () {
        let dist = this.a.dist(createVector(posRoot, height));
        strokeWeight(~~map(dist, 0, height, 16, 3, true));
        // strokeWeight(~~map(this.a.y, 0, halfHeight, 1, 10));
        if (this.a.x > posRoot) {
            bezier(posRoot, halfHeight, posRoot, halfHeight, this.a.x, halfHeight, this.a.x, this.a.y);
        }
    }

    // Root Curve - Draw a line to the root of the leaf
    this.simpleRoot = function () {
        let center = createVector(2 * posRoot, height * 0.75);
        let r = round(noise(this.a.x + this.a.y) * 50);
        if (r) {
            strokeWeight(2)
        }
        if (this.a.y != halfHeight) {
            line(this.a.x, this.a.y, center.x, center.y)
        }

    }

    // WeightedDot - Draw weighted points bassed on x position
    this.directionWeightDot = function (mn = 5, mx = 45) {
        ellipse(this.a.x, this.a.y, map(this.a.x, 0, width, mn, mx));
    }
}