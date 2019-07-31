function LeafHull(leaf) {
    this.leaf = leaf;
    this.nodes = leaf.hullNodes;

    this.draw = function () {

        // Fill Mode Switch
        (fillMode) ? setStyle(greens[0], greens[2], 5) : setStyle(null, greens[2], 5);

        switch (drawMode) {
            case 4:
                // setStyle(null, greens[2], 5);
                this.regularHull();
                setStyle(null, greens[2], 3);
                this.shinyRays(60);
                break;
            case 5:
                // setStyle(null, greens[2], 5);
                this.regularHull();
                setStyle(null, greens[2], 3);
                this.forwardStripedNoise(5, 0.5, false);
                break;
            default:
                this.regularHull();
                break;
        }
    }

    // Filling shapes
    // ---------------------------------------------------------------------------

    // Regular Hull
    this.regularHull = function () {
        beginShape();
        for (var i = 0; i < this.nodes.length; i++) {
            vertex(this.nodes[i].x, this.nodes[i].y);
        };
        endShape(CLOSE);
    }

    // Blobby Hull
    this.blobbyHull = function () {
        beginShape();
        for (var i = 0; i < this.nodes.length; i++) {
            curveVertex(this.nodes[i].x, this.nodes[i].y);
        };
        curveVertex(this.nodes[0].x, this.nodes[0].y);
        curveVertex(this.nodes[1].x, this.nodes[1].y);
        endShape(CLOSE);
    }

    // Forward Striped - horizontal stripes along the leaf, parameters for the number of stripes, noise and curvemode
    this.forwardStripedNoise = function (num = 5, variation = 0.75, curved = true) {
        let currentpoint;
        let middlepoint;
        let s = 1 / num;
        let noiseValue = 0;

        for (var j = num+1; j > 0; j--) {
            // Loop number of shapes inside the leaf
            beginShape();
            // fill((j % 2) ? greens[2] : greens[1]);

            for (var i = 0; i < this.nodes.length; i++) {
                // Draw shape with calculated lerp between hull and centerline
                middlepoint = createVector(map(this.nodes[i].x, 0, width, 2*posRoot, width - posTip), halfHeight + 50);

                if (this.nodes[i].x == posRoot) {
                    middlepoint = createVector(posRoot, halfHeight);
                }

                noiseValue = map(noise(i, j), 0, 1, -s * variation, s * variation);
                currentpoint = p5.Vector.lerp(this.nodes[i], middlepoint, s * j + noiseValue);

                // Draw curved or regular vertex point
                if (curved) {
                    curveVertex(currentpoint.x, currentpoint.y);
                } else {
                    vertex(currentpoint.x, currentpoint.y);
                }
            };

            endShape(CLOSE);
        };
    }

    // Shiny rays - from the centre line
    this.shinyRays = function (offset = 25) {
        let middlepoint;
        let interpoint

        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].y != halfHeight) {
                // draw main ray
                middlepoint = createVector(map(this.nodes[i].x, 0, width, posRoot, width - posTip), halfHeight + 10);

                beginShape();
                vertex(this.nodes[i].x, this.nodes[i].y);
                bezierVertex(this.nodes[i].x, this.nodes[i].y, middlepoint.x - offset, middlepoint.y, middlepoint.x, middlepoint.y);
                bezierVertex(middlepoint.x + offset, middlepoint.y, this.nodes[i].x, this.nodes[i].y, this.nodes[i].x, this.nodes[i].y);
                
                endShape(CLOSE);

                if (this.nodes[i-1] != null) {

                    // Variable number of repeating rays
                    noiseSeed(middlepoint.y + i);
                    let n = ~~(noise(middlepoint.x) * 5)
                    for(var j = 1; j < n; j++) {
                        interpoint = p5.Vector.lerp(this.nodes[i], this.nodes[i-1], 1 / n * j);

                        // Draw repeated ray
                        beginShape();
                        vertex(interpoint.x, interpoint.y);
                        bezierVertex(interpoint.x, interpoint.y, middlepoint.x - offset, middlepoint.y, middlepoint.x, middlepoint.y);
                        bezierVertex(middlepoint.x + offset, middlepoint.y, interpoint.x, interpoint.y, interpoint.x,interpoint.y);
                        endShape(CLOSE);
                    };
                };
            }
        };
    };
}