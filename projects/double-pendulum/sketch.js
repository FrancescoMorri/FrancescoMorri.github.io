var l1 = 125;
var l2 = 125;
var t1 = 0;
var t2 = 0;
var m1 = 10;
var m2 = 10;
var v_1 = 0;
var v_2 = 0;
var a_1 = 0;
var a_2 = 0;
var g = 1;

let px2 = -1;
let py2 = -1;
let cx, cy;

let buffer;
let m1_slider, m2_slider, l1_slider, l2_slider;
let m1_label, m2_label, l1_label, l2_label;
let start = false;

function setup(){
  let cv = createCanvas(600,500);
  cv.parent('container');

  m1_slider = createSlider(1,100,10,1);
  m1_slider.parent('inside-container')
  m1_label = createP('m1');
  m1_label.parent('inside-container');

  m2_slider = createSlider(1,100,10,1);
  m2_slider.parent('inside-container')
  m2_label = createP('m2');
  m2_label.parent('inside-container');

  l1_slider = createSlider(50,175,100,1);
  l1_slider.parent('inside-container')
  l1_label = createP('l1');
  l1_label.parent('inside-container');

  l2_slider = createSlider(50,175,100,1);
  l2_slider.parent('inside-container')
  l2_label = createP('l2');
  l2_label.parent('inside-container');

  pixelDensity(1);
  cx = width / 2;
  cy = height - 350;
  buffer = createGraphics(width, height);
  buffer.background(42);
  buffer.translate(cx, cy);
  t1 = 0;
  t2 = 0;

}

function draw(){

  m1 = m1_slider.value();
  m2 = m2_slider.value();
  l1 = l1_slider.value();
  l2 = l2_slider.value();

  background(42);

  imageMode(CORNER);
  image(buffer, 0, 0, width, height);


  a_1 = (-g*(2*m1 + m2)*sin(t1) - m2*g*sin(t1 - 2*t2) - 2*sin(t1 - t2)*m2*(v_2*v_2*l2 + v_1*v_1*l1*cos(t1 - t2)))/(l1*(2*m1 + m2*(1 - cos(2*t1 - 2*t2))));
  a_2 = (2*sin(t1 - t2)*(v_1*v_1*l1*(m1 + m2) + g*(m1 + m2)*cos(t1) + v_2*v_2*l2*m2*cos(t1 - t2)))/(l2*(2*m1 + m2*(1 - cos(2*t1 - 2*t2))));



  translate(cx,cy);

  var x1 = l1*sin(t1);
  var y1 = l1*cos(t1);
  var x2 = x1 + l2*sin(t2);
  var y2 = y1 + l2*cos(t2);


  stroke(179, 216, 76);
  line(x1,y1,x2,y2);
  noStroke();
  fill(179, 216, 76)
  ellipse(x2,y2, m2, m2);

  stroke(75, 178, 216);
  line(0,0,x1,y1);
  noStroke();
  fill(75, 178, 216)
  ellipse(x1,y1, m1, m1);

  //adjusting velocity
  v_1 += a_1;
  v_2 += a_2;
  //adjusting position
  t1 += v_1;
  t2 += v_2;


  buffer.stroke(179, 216, 76,50);
  if (frameCount > 1 && start) {
    buffer.line(px2, py2, x2, y2);
  }

  px2 = x2;
  py2 = y2;

}

function keyReleased(){
  if( key == ' '){
    var an = random(30, 2*PI);
    t1 = an;
    start = true;
  }
  return false;

}
