var points = [];
var Npoints = 700;
var cols = 10;
var rows = 10;
var neurons = [];
var alp = 0.01;

function setup() {
  cnv = createCanvas(500, 500);
  cnv.parent('container2');
  //perspective(PI / 3.0, width / height, 0.1, 500);
  var stepx = floor(width / cols);
  var stepy = floor(height / rows);
  // angle squares
  /*for (let i = 0; i < Npoints; i++) {
    let a = random(0, 1);
    if (a < 0.25) {
      points[i] = [random(50, width / 3), random(50, height / 3)];
    } else if (a >= 0.25 && a < 0.5) {
      points[i] = [
        random((2 * width) / 3, width - 50),
        random((2 * height) / 3, height - 50)
      ];
    } else if (a >= 0.5 && a < 0.75){
      points[i] = [
        random((2 * width) / 3, width - 50),
        random(50, height / 3)
      ];
    } else {
      points[i] = [
        random(50, width / 3),
        random((2 * height) / 3, height - 50)
      ];
    }
  }*/
  // spiral
  let a = 0;
  let b = 10;
  angleMode(RADIANS);
  let theta = 0
  let spiral = [];
  for(let j = 0; j<500; j++){
    let r = a+b*theta;
    spiral[j] = [
      width/2 + r*cos(theta),
      height/2 + r*sin(theta)
    ];
    if(theta < PI){
      theta += 0.09;
    } else if (theta >= PI && theta < 1.5*PI) {
      theta += 0.05;
    } else {
      theta += 0.03;
    }
  }
  for(let i = 0; i < Npoints; i ++){
    let a = int(random(0,spiral.length));
    points[i] = [
      spiral[a][0]+random(-5,5),
      spiral[a][1]+random(-5,5)
    ];
  }
  // sine wave
  /*
  let sine = [];
  for(let j = 0; j<500; j++){
    sine[j] = [
      map(j, 0, 500, 0, width),
      height/3*sin(map(j,0,500,0,2*PI)) + height/2
    ];
  }
  for(let i = 0; i < Npoints; i ++){
    let a = int(random(0,sine.length));
    points[i] = [
      sine[a][0]+random(-10,10),
      sine[a][1]+random(-10,10)
    ];
  }
  */
  
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if(r == 0 && c == 0){
        neurons[r * rows + c] = new Neuron(
        c * stepx + stepx / 2,
        r * stepy + stepy / 2,
        5,
        [r * rows + c + 1, (r+1) * rows + c]
      );
      }
      else if(r == 0 && c == cols - 1){
        neurons[r * rows + c] = new Neuron(
        c * stepx + stepx / 2,
        r * stepy + stepy / 2,
        5,
        [r * rows + c - 1, (r+1) * rows + c]
      );
      }
      else if(r == 0 && c > 0 && c < cols - 1){
        neurons[r * rows + c] = new Neuron(
        c * stepx + stepx / 2,
        r * stepy + stepy / 2,
        5,
        [r * rows + c - 1, (r+1) * rows + c, r * rows + c + 1]
      );
      }
      else if(r > 0 && r < rows - 1 && c == 0){
        neurons[r * rows + c] = new Neuron(
        c * stepx + stepx / 2,
        r * stepy + stepy / 2,
        5,
        [(r-1) * rows + c, (r+1) * rows + c, r * rows + c + 1]
      );
      }
      else if(r == rows - 1 && c == 0){
        neurons[r * rows + c] = new Neuron(
        c * stepx + stepx / 2,
        r * stepy + stepy / 2,
        5,
        [(r-1) * rows + c, r * rows + c + 1]
      );
      }
      else if(r == rows - 1 && c > 0 && c < cols - 1){
        neurons[r * rows + c] = new Neuron(
        c * stepx + stepx / 2,
        r * stepy + stepy / 2,
        5,
        [(r-1) * rows + c, r * rows + c + 1, r * rows + c - 1]
      );
      }
      else if(r > 0 && r < rows - 1 && c == cols - 1){
        neurons[r * rows + c] = new Neuron(
        c * stepx + stepx / 2,
        r * stepy + stepy / 2,
        5,
        [(r-1) * rows + c, (r+1) * rows + c, r * rows + c - 1]
      );
      }
      else{
        neurons[r * rows + c] = new Neuron(
        c * stepx + stepx / 2,
        r * stepy + stepy / 2,
        5,
        [(r-1) * rows + c, (r+1) * rows + c, r * rows + c - 1, r * rows + c + 1]
      );
      }
    }
  }
}

function draw() {
  //frameRate(25);
  //translate(width/2,height/2);
  background(220);
  var neuron_color = color(250,50,50);
  for (let p of points) {
    push();
    noStroke();
    fill(10);
    ellipse(p[0], p[1], 3, 3);
    pop();
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r * rows + c < neurons.length - 1) {
        if (c < cols - 1 && r < rows - 1) {
          draw_edge(neurons[r * rows + c], neurons[r * rows + c + 1]);
          draw_edge(neurons[r * rows + c], neurons[(r + 1) * rows + c]);
        } else if (c == cols - 1 && r < rows - 1) {
          draw_edge(neurons[r * rows + c], neurons[(r + 1) * rows + c]);
        } else if (r == rows - 1) {
          draw_edge(neurons[r * rows + c], neurons[r * rows + c + 1]);
        }
        neurons[r * rows + c].draw(neuron_color);
        neurons[r * rows + c + 1].draw(neuron_color);
      }
    }
  }
  // select a random point
  var sel_p = points[int(random(0, points.length))];
  //noStroke();
  //fill(0,255,0);
  //ellipse(sel_p[0], sel_p[1], 7, 7);
  var best_dist = 100000;
  var bmu = 0;
  for(let i = 0; i < neurons.length-1; i++){
    let new_dist = neurons[i].euclid_dist(sel_p[0], sel_p[1]);
    if(new_dist < best_dist){
      best_dist = new_dist;
      bmu = i;
    }
  }
  //neurons[bmu].s = 10;
  //neurons[bmu].draw(color(0,255,255));
  //neurons[bmu].s = 5;
  neurons[bmu].update(sel_p, alp, 1);
  for(let i of neurons[bmu].neigh_index){
    //let d = neurons[i].euclid_dist(neurons[bmu].x, neurons[bmu].y);
    let d = 1;
    neurons[i].update(sel_p, alp, d);
  }
  
}

function draw_edge(n1, n2) {
  strokeWeight(2);
  stroke(250, 50, 50, 100);
  line(n1.x, n1.y, n2.x, n2.y);
}
