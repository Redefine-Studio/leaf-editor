let greens = [];
let browns = [];
// green0 #acbfba
// green1 #8ea59f
// green2 #758d87 => Default Green
// green3 #536661
// green4 #36413e
// green5 #161a19
// browns[0] #B5ACA6
// browns[1] #6B5F55

function setColors() {
    greens[0] = color(165, 10, 75);
    greens[1] = color(165, 14, 65);
    greens[2] = color(165, 17, 55);
    greens[3] = color(165, 18, 40);
    greens[4] = color(165, 17, 25);
    greens[5] = color(165, 15, 10);
    browns[0] = color(24, 8, 71);
    browns[1] = color(27, 21, 42);
}


// Set the drawing Style: FillColor, StrokeColor, StrokeWeight
function setStyle(fc, sc = null, sw = null) {
    fc ? fill(fc) : noFill();
    sc ? stroke(sc) : noStroke();
    sw ? strokeWeight(sw) : 0;
}

function randomGreen(s) {
    i = floor(noise(s * 50) * greens.length)
    return greens[i]
}