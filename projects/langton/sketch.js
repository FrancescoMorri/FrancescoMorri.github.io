var world = [];
var scl = 2;
var rows, cols;
var ant;
var directions = [0,1,2,3];
var steps = 0;
var steps_lab;

function setup() {
  cnv = createCanvas(500, 500);
  cnv.parent("container");
  angleMode(RADIANS);
  rows = height/scl;
  cols = width/scl;
  for(let i = 0; i<cols; i++){
    world[i] = [];
    for(let j = 0; j<rows; j++){
      world[i][j] = 0;
    }
  }
  let a = int(random(0,rows));
  let b = int(random(0,cols));
  ant = new Ant(a, b, world[a][b], 0);


}

function draw() {
  //steps_label = createElement('p', str(steps));
  //frameRate(1);
  background(250);



  /*for(let x = 0; x<cols; x++){
    for(let y = 0; y<rows; y++){
      stroke(40);
      line(x*scl, 0, x*scl, height);
      line(0, y*scl, width, y*scl);
    }
  }*/

  for(let x = 0; x<cols; x++){
    for(let y = 0; y<rows; y++){

      if(world[x][y] == 1){
        noStroke();
        fill(22, 22, 22, 150);
        rect(x*scl, y*scl, scl, scl);
      }
    }
  }

  /*noStroke();
  fill(250);
  rect(10, 10, 30, 30);*/

  fill(0);
  textSize(25);
  text(steps, 15, 25);


  ant.show();
  ant.check();
  world[ant.x][ant.y] = ant.state;
  ant.move();
  ant.state = world[ant.x][ant.y];
  steps += 1;


}
