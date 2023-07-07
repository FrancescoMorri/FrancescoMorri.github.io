var att = [];
var tail_pos = [];
var satellites = [];
const n_sat = 50;
const n_magn = 10;
const radius = 100;
const G = 50;

function setup() {
  cnv = createCanvas(600, 600);
  cnv.mousePressed(add_magn);
  cnv.parent('container');
  for (let i = 0; i < n_sat; i++) {
    let c = color(random(0, 255), random(0, 255), random(0, 255), 10);
    let a = map(i, 0, n_sat, 0, 2 * PI);
    let x = width / 2 + radius * cos(a);
    let y = height / 2 + radius * sin(a);
    satellites[i] = new planet(x, y, c);
    //satellites[i].vel = p5.Vector.random2D();
  }
    /*
  for (let i = 0; i < n_magn; i++) {
    let a = map(i, 0, n_magn, 0, 2 * PI);
    let xx = width / 2 + 150 * cos(a);
    let yy = height / 2 + 150 * sin(a);
    att.push(new magnets(xx, yy, -1));
  }
  */
  //att.push(new magnets(width/2, height/2, -1));
  background(10);
}

function draw() {
  //print(frameRate());
  //background(10);
  if (att.length > 0) {
    for (let i = 0; i < n_sat; i++) {
      satellites[i].show();
    }
  }

  for (let i = 0; i < n_sat; i++) {
    for (let j = 0; j < att.length; j++) {
      satellites[i].update(att[j], G);
    }
    satellites[i].move();
  }
}

function add_magn() {
  if (mouseButton == LEFT) {
    att.push(new magnets(mouseX, mouseY, -1));
  } else if (mouseButton == RIGHT) {
    att.push(new magnets(mouseX, mouseY, 1));
  }
}
