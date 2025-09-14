let flock = [];

let align_slider, cohesion_slider, avoid_slider;
let align_label, cohesion_label, avoid_label;

function setup() {
  cv = createCanvas(700, 500);
  cv.parent('container');
  for (let i = 0; i < 100; i++) {
    let pos = createVector(random(0, width), random(0, height));
    let vel = p5.Vector.random2D().mult(2);
    flock[i] = new boids(pos, vel, 50);
  }

  align_slider = createSlider(0, 2, 0.5, 0.1);
  align_slider.parent('inside-container');
  align_label = createP('Alignment');
  align_label.parent('inside-container');

  cohesion_slider = createSlider(0, 2, 1, 0.1);
  cohesion_slider.parent('inside-container');
  cohesion_label = createP('Cohesion');
  cohesion_label.parent('inside-container');

  avoid_slider = createSlider(0, 2, 0.9, 0.1);
  avoid_slider.parent('inside-container');
  avoid_label = createP('Separation');
  avoid_label.parent('inside-container');
}

function draw() {
  background(100);
  let i = 0;
  let col = color(250,250,250); 
  let align = align_slider.value();
  let center = cohesion_slider.value();
  let avoid = avoid_slider.value();
  for (let b of flock) {
    b.check_edges();
    b.compute_acc(flock, align, center, avoid);
    b.update();
    b.show(col);
  }
}
