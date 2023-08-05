let slider;
var ps = [];
var totpart = 400;
var K = 0;
var S = 3;
var max_d = 100;
var cohe = 1;
var align = 1;
var avoid = 1.5;

function setup(){
  cv = createCanvas(720,480);
  cv.parent('container');
  noStroke();
  slider = createSlider(0, 1.5, 0, 0.01);
  slider.parent('inside-container');
  slider.position(30, height-40);
  label = createElement('p', 'K');
  label.parent('inside-container');
  label.position(slider.x - 20, slider.y);
  //slider.style('width', '80px');
  for(var i = 0; i < totpart; i++){
    ps[i] = new particles(random(0,width), random(0,height), random(-4,4), random(-4,4), random(0,2*PI), random(-0.5,0.5));
  }
}

function draw(){
  //frameRate(10);
  background(0);
  K = slider.value();
  for(let p of ps){
    p.update(ps,cohe,avoid,align,K);
    p.borders();
    p.show();
  }
}