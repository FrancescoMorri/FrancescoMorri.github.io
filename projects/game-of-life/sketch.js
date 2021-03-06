var world = [];
var back = [];
var scl = 10;
var sidex, sidey;



function setup() {
  cnv = createCanvas(800, 500);
  cnv.parent("container");
  cnv.mousePressed(random_start);

  sidex = width / scl;
  sidey = height / scl;

  for (let i = 0; i < sidex; i++) {
    world[i] = [];
    back[i] = [];
    for (let j = 0; j < sidey; j++) {
      world[i][j] = 0;
      back[i][j] = 0;
    }
  }

}

var start = false;

function draw() {
  frameRate(10);
  background(220);
  for (let i = 0; i < sidex; i++) {
    for (let j = 0; j < sidey; j++) {
      stroke(50);
      line(i*scl, 0, i*scl, height);
      line(0, j*scl, width, j*scl);
      if (world[i][j] == 1) {
        noStroke();
        fill(11);
        rect(i * scl, j * scl, scl, scl);
      }
    }
  }

  if (start) {

    for (let x = 0; x < sidex; x++) {
      for (let y = 0; y < sidey; y++) {

        let neigh = 0;

        for(let i = -1; i<=1; i++){
          for(let j = -1; j<=1; j++){
            neigh += world[(x+i+sidex)%sidex][(y+j+sidey)%sidey];
          }
        }
        neigh -= world[x][y];

        //alive cell remains alive only with 2 or 3 neigh
        if (world[x][y] == 1 && neigh < 2) {

          back[x][y] = 0;

        }else if(world[x][y] == 1 && neigh > 3){

          back[x][y] = 0;

        }else if(world[x][y] == 0 && neigh == 3){

          back[x][y] = 1;

        }else{

          back[x][y] = world[x][y];

        }
      }
    }
    let tmp = back;
    back = world;
    world = tmp;
  }
}

function random_start(){
  var x = floor(mouseX/scl);
  var y = floor(mouseY/scl);

  if(mouseButton === LEFT){
    if(world[x][y] == 1){
      world[x][y] = 0;
    }
    else{
      world[x][y] = 1;
    }

  }

  else if(mouseButton === RIGHT){
    start = !start;
  }
}
