class Particle {
    constructor() {
        this.pos = createVector(width * 0.5, height * 0.5);
    }

    show() {
        ellipse(this.pos.x, this.pos.y, 8);
    }

    update(x, y) {
        this.pos.set(x, y);
    }
}