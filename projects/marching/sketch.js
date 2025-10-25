let Nx, Ny;
let grid_size = 250;
let lenx, leny;
let balls = [];
let Nballs = 15;
let step = 0;
let check;
let previously_checked = false;

function setup() {
  cv = createCanvas(500, 500);
  cv.parent("container");
  if(width >= height){
    Nx = grid_size;
    lenx = floor(width/Nx);
    leny = lenx;
    Ny = floor(height/leny);
  } else {
    Ny = grid_size;
    leny = floor(height/Ny);
    lenx = leny;
    Nx = floor(width/lenx);
  }
  for(let n = 0; n<Nballs; n++){
    balls[n] = new ball(random(50, width-50), random(50, height-50), random(30, 50), random(-4,4), random(-4,4));
  }
  check = createCheckbox();
  check.parent("inside-container");
  check.position(0, height - 25);
  background(0);
}

function draw() {
  if(!previously_checked && ! check.checked()) {
    background(0);
    strokeWeight(1);
  } else if (!previously_checked && check.checked()) {
    clear();
    background(0);
    strokeWeight(0.01);
    previously_checked = true;
  } else if (previously_checked && check.checked()) {
    strokeWeight(0.01);
    previously_checked = true;
  } else {
    clear();
    previously_checked = false;
  }
  //frameRate(2);
  step += 0.001;
  for(let i = 0; i<Nx+1; i++){
    for(let j = 0; j<Ny+1; j++){
      let D = f(balls, i*lenx, j*leny);
      let C = f(balls, (i+1)*lenx, j*leny);
      let B = f(balls, (i+1)*lenx, (j+1)*leny);
      let A = f(balls, i*lenx, (j+1)*leny);
      let code = "" + D + C + B + A;
      let index = parseInt(code, 2);
      shapes(index, i*lenx, j*leny, lenx);
      //noStroke();
      //fill((1-D)*250,D*250,0);
      //ellipse(i*lenx, j*leny, 3, 3);
    }
  }
  
    for(let b of balls){
    b.check();
    b.move();
    //b.show();
  }
  //balls[0].x = mouseX;
  //balls[0].y = mouseY;
  
}

function f(balls, x, y){
  let sum = 0;
  for(let b of balls){
    sum += (b.r*b.r)/((x-b.x)*(x-b.x) + (y-b.y)*(y-b.y));
  }
  if(sum >= 1){
    return 1;
  } else {
    return 0;
  }
}

function shapes(index, x, y, size){
  
  stroke(((1 + sin(step))/2)*250,250,((1 + cos(step))/2)*250);
  if(index == 1){
    line(x, y + size/2, x + size/2, y + size);
  } else if(index == 2){
    line(x + size/2, y + size, x + size, y + size/2);
  } else if(index == 3){
    line(x, y + size/2, x + size, y + size/2);
  } else if(index == 4){
    line(x + size/2, y, x + size, y + size/2);
  } else if(index == 5){
    line(x + size/2, y + size, x + size, y + size/2);
    line(x, y + size/2, x + size/2, y);
  } else if(index == 6){
    line(x + size/2, y, x + size/2, y + size);
  } else if(index == 7){
    line(x, y + size/2, x + size/2, y);
  } else if(index == 8){
    line(x, y + size/2, x + size/2, y);
  } else if(index == 9){
    line(x + size/2, y, x + size/2, y + size);
  } else if(index == 10){
    line(x, y + size/2, x + size/2, y + size);
    line(x + size, y + size/2, x + size/2, y + size);
  } else if(index == 11){
    line(x + size/2, y, x + size, y + size/2);
  } else if(index == 12){
    line(x, y + size/2, x + size, y + size/2);
  } else if(index == 13){
    line(x + size/2, y + size, x + size, y + size/2);
  } else if(index == 14){
    line(x, y + size/2, x + size/2, y + size);
  }
}