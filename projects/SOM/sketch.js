var points = [];
var Npoints = 700;
var cols = 5;
var rows = 5;
var floors = 5;
var neurons = [];
var alp = 0.01;
var test = 0;
var tot_side = 300
var stepx = tot_side/rows;
var stepy = tot_side/cols;
var stepz = tot_side/(floors-1);
var start = false;

function setup() {
  cnv = createCanvas(500, 500, WEBGL);
  cnv.parent('container');
}

function draw() {
  background(220);
  orbitControl();
  rotateX(PI / 4);
  translate(0,-50,-100);
  var neuron_color = color(250, 50, 50);
  
  for (let p of points) {
    push();
    noStroke();
    fill(10);
    translate(p[0], p[1], p[2]);
    box(5);
    //ellipse(p[0], p[1], 3, 3);
    pop();
  }
  if(start){
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for(let f = 0; f < floors; f++){
        if (r *(floors * cols) + c * cols + f < neurons.length - 1) {
        if (c < cols - 1 && r < rows - 1 && f < floors - 1) {
          draw_edge(neurons[r * (floors * cols) + c * floors + f], neurons[r * (floors * cols) + c * floors + f + 1]);
          
          draw_edge(neurons[(r + 1) * (floors * cols) + c * floors + f], neurons[r * (floors * cols) + c * floors + f]);
          
          draw_edge(neurons[r * (floors * cols) + (c + 1) * floors + f], neurons[r * (floors * cols) + c * floors + f ]);
          
        } else if (f == floors - 1 && c < cols - 1 && r < rows - 1) {
          draw_edge(neurons[r * (floors * cols) + (c + 1) * floors + f], neurons[r * (floors * cols) + c * floors + f ]);
          draw_edge(neurons[(r + 1) * (floors * cols) + c * floors + f], neurons[r * (floors * cols) + c * floors + f ]);
        } else if (c == cols - 1 && r < rows - 1 && f < floors - 1) {
          draw_edge(neurons[r * (floors * cols) + c * floors + f + 1], neurons[r * (floors * cols) + c * floors + f ]);
          draw_edge(neurons[(r + 1) * (floors * cols) + c * floors + f], neurons[r * (floors * cols) + c * floors + f ]);
        } else if (r == rows - 1 && f < floors - 1 && c < cols - 1) {
          draw_edge(neurons[r * (floors * cols) + (c + 1) * floors + f], neurons[r * (floors * cols) + c * floors + f ]);
          draw_edge(neurons[r * (floors * cols) + c * floors + f + 1], neurons[r * (floors * cols) + c * floors + f ]);
        } else if (r == rows - 1 && f == floors - 1 && c < cols - 1) {
          draw_edge(neurons[r * (floors * cols) + (c + 1) * floors + f], neurons[r * (floors * cols) + c * floors + f ]);
        } else if (r < rows - 1 && f == floors - 1 && c == cols - 1) {
          draw_edge(neurons[(r + 1) * (floors * cols) + c * floors + f], neurons[r * (floors * cols) + c * floors + f ]);
        } else if (r == rows - 1 && f < floors - 1 && c == cols - 1) {
          draw_edge(neurons[r * (floors * cols) + c * floors + f + 1], neurons[r * (floors * cols) + c * floors + f ]);
        }
        neurons[r * (floors * cols) + c * floors + f].draw(neuron_color);
        neurons[r *(floors * cols) + c * cols + f + 1].draw(neuron_color);
      }
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
  for (let i = 0; i < neurons.length - 1; i++) {
    let new_dist = neurons[i].euclid_dist(sel_p[0], sel_p[1], sel_p[2]);
    if (new_dist < best_dist) {
      best_dist = new_dist;
      bmu = i;
    }
  }
  //neurons[bmu].s = 10;
  //neurons[bmu].draw(color(0,255,255));
  //neurons[bmu].s = 5;
    neurons[bmu].update(sel_p, alp);
    for(let i of neurons[bmu].neigh_index){
      neurons[i].update(sel_p, alp);
    }
  }
}

function draw_edge(n1, n2) {
  strokeWeight(2);
  stroke(250, 50, 50, 100);
  line(n1.x, n1.y, n1.z, n2.x, n2.y, n2.z);
}

function init_neurons(){
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (let f = 0; f < floors; f++) {
        if (r == 0 && c == 0 && f == 0) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + (c + 1) * cols + f, (r + 1) *(floors * cols) + c * cols + f]
          );
        } else if (r == rows - 1 && c == 0 && f == 0) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + (c + 1) * cols + f, (r - 1) *(floors * cols) + c * cols + f]
          );
        } else if (r == rows - 1 && c == cols - 1 && f == 0) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + (c - 1) * cols + f, (r - 1) *(floors * cols) + c * cols + f]
          );
        } else if (r == 0 && c == cols - 1 && f == 0) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + (c - 1) * cols + f, (r + 1) *(floors * cols) + c * cols + f]
          );
        } else if (r == 0 && c == 0 && f == floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, r *(floors * cols) + (c + 1) * cols + f, (r + 1) *(floors * cols) + c * cols + f]
          );
        } else if (r == rows - 1 && c == 0 && f == floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, r *(floors * cols) + (c + 1) * cols + f, (r - 1) *(floors * cols) + c * cols + f]
          );
        } else if (r == rows - 1 && c == cols - 1 && f == floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, r *(floors * cols) + (c - 1) * cols + f, (r - 1) *(floors * cols) + c * cols + f]
          );
        } else if (r == 0 && c == cols - 1 && f == floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, r *(floors * cols) + (c - 1) * cols + f, (r + 1) *(floors * cols) + c * cols + f]
          );
        } else if (r > 0 && r < rows - 1 && c == 0 && f == 0) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [(r - 1) *(floors * cols) + c * cols + f, (r + 1) *(floors * cols) + c * cols + f, r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + (c + 1) * cols + f ]
          );
        } else if (r > 0 && r < rows - 1 && c == cols - 1 && f == 0) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [(r - 1) *(floors * cols) + c * cols + f, (r + 1) *(floors * cols) + c * cols + f, r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + (c - 1) * cols + f ]
          );
        } else if (r == 0 && c > 0 && c < cols - 1 && f == 0) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f + 1, (r + 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c + 1) * cols + f, r *(floors * cols) + (c - 1) * cols + f ]
          );
        }
        else if (r == rows - 1 && c > 0 && c < cols - 1 && f == 0) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f + 1, (r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c + 1) * cols + f, r *(floors * cols) + (c - 1) * cols + f ]
          );
        }
        else if (r == rows - 1 && c > 0 && c < cols - 1 && f == floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, (r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c + 1) * cols + f, r *(floors * cols) + (c - 1) * cols + f ]
          );
        } else if (r == 0 && c > 0 && c < cols - 1 && f == floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, (r + 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c + 1) * cols + f, r *(floors * cols) + (c - 1) * cols + f ]
          );
        } else if (r > 0 && r < rows - 1 && c == cols - 1 && f == floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, (r + 1) *(floors * cols) + c * cols + f, (r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c - 1) * cols + f ]
          );
        } else if (r > 0 && r < rows - 1 && c == 0 && f == floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, (r + 1) *(floors * cols) + c * cols + f, (r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c + 1) * cols + f ]
          );
        } else if (r == 0 && c == 0 && f > 0 && f < floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, r *(floors * cols) + c * cols + f + 1, (r + 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c + 1) * cols + f]
          );
        } else if (r == 0 && c == cols - 1 && f > 0 && f < floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, r *(floors * cols) + c * cols + f + 1, (r + 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c - 1) * cols + f]
          );
        } else if (r == rows - 1 && c == cols - 1 && f > 0 && f < floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, r *(floors * cols) + c * cols + f + 1, (r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c - 1) * cols + f]
          );
        } else if (r == rows - 1 && c == 0 && f > 0 && f < floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, r *(floors * cols) + c * cols + f + 1, (r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c + 1) * cols + f]
          );
        } else if (r > 0 && r < rows - 1 && c > 0 && c < cols - 1 && f == 0) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f + 1, (r + 1) *(floors * cols) + c * cols + f, (r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c + 1) * cols + f, r *(floors * cols) + (c - 1) * cols + f]
          );
        } else if (r > 0 && r < rows - 1 && c > 0 && c < cols - 1 && f == floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + c * cols + f - 1, (r + 1) *(floors * cols) + c * cols + f, (r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c + 1) * cols + f, r *(floors * cols) + (c - 1) * cols + f]
          );
        } else if (r == 0 && c > 0 && c < cols - 1 && f > 0 && f < floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [(r + 1) *(floors * cols) + c * cols + f, r *(floors * cols) + c * cols + f - 1, r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + (c + 1) * cols + f, r *(floors * cols) + (c - 1) * cols + f]
          );
        } else if (r == rows - 1 && c > 0 && c < cols - 1 && f > 0 && f < floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [(r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + c * cols + f - 1, r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + (c + 1) * cols + f, r *(floors * cols) + (c - 1) * cols + f]
          );
        } else if (r > 0 && r < rows - 1 && c == cols - 1 && f > 0 && f < floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + (c - 1) * cols + f, (r + 1) *(floors * cols) + c * cols + f, (r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + c * cols + f - 1]
          );
        } else if (r > 0 && r < rows - 1 && c == 0 && f > 0 && f < floors - 1) {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [r *(floors * cols) + (c + 1) * cols + f, (r + 1) *(floors * cols) + c * cols + f, (r - 1) *(floors * cols) + c * cols + f, r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + c * cols + f - 1]
          );
        } else {
          test += 1;
          neurons[r * (floors * cols) + c * floors + f] = new Neuron(
            -(stepx*rows)/2 + c * stepx + stepx / 2,
            -(stepy*cols)/2 + r * stepy + stepy / 2,
            stepz*(floors-1) - f*stepz,
            5,
            [(r - 1) *(floors * cols) + c * cols + f, (r + 1) *(floors * cols) + c * cols + f, r *(floors * cols) + (c + 1) * cols + f, r *(floors * cols) + (c - 1) * cols + f, r *(floors * cols) + c * cols + f + 1, r *(floors * cols) + c * cols + f - 1]
          );
        }
      }
    }
  }

}

function init_spiral(){
  let a = 0;
  let b = 10;
  angleMode(RADIANS);
  let theta = 0;
  let spiral = [];
  let N = 600;
  for (let j = 0; j < N; j++) {
    let r = a + b * theta;
    spiral[j] = [r * cos(theta), r * sin(theta), map(j, 0, N, 0, tot_side)];
    if (theta < PI) {
      theta += 0.09;
    } else if (theta >= PI && theta < 1.5 * PI) {
      theta += 0.05;
    } else {
      theta += 0.03;
    }
  }
  for (let i = 0; i < Npoints; i++) {
    let a = int(random(0, spiral.length));
    points[i] = [
      spiral[a][0] + random(-5, 5),
      spiral[a][1] + random(-5, 5),
      spiral[a][2],
    ];
  }
}

function init_sphere(){
  var r = 150;
  for (let i = 0; i < Npoints; i++) {
    let a = random(0,2*PI);
    let b = random(-PI/2,PI/2);
    points[i] = [
      r*cos(b)*sin(a),
      r*cos(b)*cos(a),
      r+r*sin(b)
    ];
  }
}

function keyPressed(){
  print(key);
  if (key == '0'){
    init_sphere();
    init_neurons();
  } else if (key == '1'){
    init_spiral();
    init_neurons();
  }
  start = true;
}