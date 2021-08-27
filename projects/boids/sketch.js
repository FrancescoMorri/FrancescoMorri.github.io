let flock = [];

let align_slider, cohesion_slider, avoid_slider;
let align_label, cohesion_label, avoid_label;

function setup() {
  cv = createCanvas(700, 500);
  cv.parent('container');
  for (let i = 0; i < 100; i++) {
    let pos = createVector(random(0, width), random(0, height));
    let vel = p5.Vector.random2D().mult(5);
    flock[i] = new boids(pos, vel, 50);
  }

  align_slider = createSlider(1,5,1,0.1);
  align_slider.parent('inside-container')
  align_slider.position(10,5);
  align_slider.style('width', '50px');
  align_label = createElement('p', 'Alignment');
  align_label.position(align_slider.x + align_slider.width, align_slider.y);
  align_label.parent('inside-container');

  cohesion_slider = createSlider(1,5,1,0.1);
  cohesion_slider.parent('inside-container')
  cohesion_slider.position(10,25);
  cohesion_slider.style('width', '50px');
  cohesion_label = createElement('p', 'Cohesion');
  cohesion_label.position(cohesion_slider.x + cohesion_slider.width, cohesion_slider.y);
  cohesion_label.parent('inside-container');

  avoid_slider = createSlider(1,5,1,0.1);
  avoid_slider.parent('inside-container')
  avoid_slider.position(10,45);
  avoid_slider.style('width', '50px');
  avoid_label = createElement('p', 'Separation');
  avoid_label.position(avoid_slider.x + avoid_slider.width, avoid_slider.y);
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
