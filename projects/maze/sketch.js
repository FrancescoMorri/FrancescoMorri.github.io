var grid = [];
var stack = [];
var w = 10;
var cols, rows;
var current;


function setup() {
  let renderer = createCanvas(600, 600);
  renderer.parent('container');
  cols = floor(width/w);
  rows = floor(height/w);
  for(var i = 0; i<cols; i++){
    for(var j = 0; j<rows; j++){
      var cell = new Cell(i,j);
      grid.push(cell);
    }
  }
  current = grid[0];
  stack.push(current);
}

//var last = false;

function draw() {
  background('#2A2A2A');
  for(var i = 0; i<grid.length; i++){
    grid[i].show();
  }

  current.visited = true;
  current.highlight();
  /*if(last){
    noLoop();
  }*/
  var next = current.checkNeig();
  if(next){
    next.visited = true;

    stack.push(next);

    removeWalls(current, next);


    current = next;
  }
  else if(stack.length > 0){
    current = stack.pop();
  }
  /*if(current.x == 0 && current.y == 0){
    last = true;
  }*/



}

function removeWalls(a, b){
  let x = a.x - b.x;
  let y = a.y - b.y;

  if(x === 1){
    a.walls[3] = false;
    b.walls[1] = false;
  }
  else if(x === -1){
    a.walls[1] = false;
    b.walls[3] = false;
  }
  if(y === 1){
    a.walls[0] = false;
    b.walls[2] = false;
  }
  else if(y === -1){
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function index(i,j){
  if(i < 0 || i > cols-1 || j < 0 || j > rows-1){
    return -1;
  }
  return j+i*rows;
}

function keyReleased(){
  if(key == ' '){
    grid = []
    stack = []
    for(var i = 0; i<cols; i++){
      for(var j = 0; j<rows; j++){
        var cell = new Cell(i,j);
        grid.push(cell);
      }
    }
    current = grid[0];
    stack.push(current);
    //last = true;
  }
  return false;
}
