var h = 50;
var s = 30;
var sizeX = 50;
var sizeY = 80;
var noiseX = 0;
var noiseY = 0;
var inc = 0.05;
var colors = [];

function setup() {
  cnv = createCanvas(500, 400, WEBGL);
  cnv.parent('container');
  colors = [color(74,177,246,50),color(181,216,110),color(79,166,42),color(186,148,22),color(85,82,73)];
  
}

function draw() {
  background(10);
  rotateX(-200);
  translate(0,50,-150);
  let dirX = (mouseX / width - 0.5) * 2;
  let dirY = (mouseY / height - 0.5) * 2;
  directionalLight(250, 250, 250, -dirX, -dirY, -1);
  if (keyIsPressed && keyCode === RIGHT_ARROW) {
    noiseX += 0.1;
  } else if (keyIsPressed && keyCode === LEFT_ARROW) {
    noiseX -= 0.1;
  }
  if (keyIsPressed && keyCode === DOWN_ARROW) {
    noiseY += 0.1;
  } else if (keyIsPressed && keyCode === UP_ARROW) {
    noiseY -= 0.1;
  }
  noStroke();
  for(let i = 0; i<sizeY; i++){
    let he = 0;
    for(let j = 0; j<sizeX; j++){
      he = h + (7*h)*noise(noiseX+inc*j,noiseY+inc*i);
      c = floor(map(he, h, 8*h, 0, 5.5));
      fill(colors[c]);
      ambientMaterial(colors[c]);
      push();
      translate((j-sizeX/2)*s,(i-sizeY/2)*s,0);
      box(s,s,he);
      pop();
    }
  }
}

