var cells = [];
let N_cells = 200;
let N_cells_y, N_cells_x;
var cell_width, cell_height;
let input;
//Neumann boundaries
//123456780, 12345670, 1234505, 12345054, 123450543, 76564534, 4294967286, 42949673
var ruleValue;
let ruleSet;
let slider;
let valueDisplayer;

function setup() {
  let cv = createCanvas(600,600);
  cv.parent('container');
  

  input = createInput("123456780");
  input.parent('inside-container');
  input.position(0, height-25);

  ruleValue = int(input.value());
  ruleSet = ruleValue.toString(2).padStart(32, "0");
  
  if (width >= height) {
    N_cells_x = N_cells;
    cell_width = floor(width / N_cells_x);
    cell_height = cell_width;
    N_cells_y = floor(height / cell_height);
  } else {
    N_cells_y = N_cells;
    cell_height = floor(height / N_cells_y);
    cell_width = cell_height;
    N_cells_x = floor(width / cell_width);
  }

  for (let j = 0; j < N_cells_y; j++) {
    cells[j] = [];
    for (let i = 0; i < N_cells_x; i++) {
      if (random(0, 1) < 0) {
        cells[j][i] = 1;
      } else {
        cells[j][i] = 0;
      }
    }
  }

  cells[floor(N_cells_y / 2)][floor(N_cells_x / 2)] = 1;
  background(10);
}

function draw() {
  let new_ruleValue = int(input.value());
  frameRate(10);
  fill(10);

  if (new_ruleValue != ruleValue) {
    ruleValue = new_ruleValue;
    ruleSet = ruleValue.toString(2).padStart(8, "0");
    for (let j = 0; j < N_cells_y; j++) {
      cells[j] = [];
      for (let i = 0; i < N_cells_x; i++) {
        if (random(0, 1) < 0) {
          cells[j][i] = 1;
        } else {
          cells[j][i] = 0;
        }
      }
    }
    cells[floor(N_cells_y / 2)][floor(N_cells_x / 2)] = 1;
  }

  var new_cells = [];
  noStroke();
  for (let j = 0; j < N_cells_y; j++) {
    for (let i = 0; i < N_cells_x; i++) {
      if (cells[j][i] == 0) {
        fill(0);
      } else {
        fill(
          (1 - i / N_cells_x) * 255,
          (1 - i / N_cells_x) * 255,
          (j / N_cells_y) * 255
        );
      }
      rect(i * cell_width, j * cell_height, cell_width, cell_height);
    }
  }
  fill(255);

  for (let j = 0; j < N_cells_y; j++) {
    new_cells[j] = [];
    for (let i = 0; i < N_cells_x; i++) {
      //let a = cells[(j - 1 + N_cells_y)%N_cells_y][(i - 1 + N_cells_x)%N_cells_x];
      let b = cells[(j - 1 + N_cells_y) % N_cells_y][i];
      //let c = cells[(j - 1 + N_cells_y)%N_cells_y][(i+1)%N_cells_x];

      let d = cells[j][(i - 1 + N_cells_x) % N_cells_x];
      let e = cells[j][i];
      let f = cells[j][(i + 1) % N_cells_x];

      //let g = cells[(j + 1 )%N_cells_y][(i - 1 + N_cells_x)%N_cells_x];
      let h = cells[(j + 1) % N_cells_y][i];
      //let k = cells[(j + 1 )%N_cells_y][(i+1)%N_cells_x];
      let new_value = compute_rule(b, d, e, f, h, ruleSet);
      new_cells[j][i] = new_value;
    }
  }

  cells = new_cells;
}

function compute_rule(b, d, e, f, h, ruleSet) {
  let config = "" + b + d + e + f + h;
  let value = ruleSet.length - 1 - parseInt(config, 2);
  return parseInt(ruleSet[value]);
}

function keyPressed() {
  if (key == "s") {
    saveCanvas("ca.png");
  }
}
