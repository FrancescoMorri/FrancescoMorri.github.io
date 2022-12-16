var r = 50;
var step = 0;
var step2 = 0.5;
var step3 = 1;
var step4 = -0.3;
var step5 = 0;
var step6 = 0.5;
var points = []
var slider1,slider2, slider3;

function setup() {
  createCanvas(400, 400);
  slider1 = createSlider(-0.3, 0.3, 0.01, 0.01);
  slider1.position(10, 10);
  slider1.style('width', '80px');
  slider2 = createSlider(-0.3, 0.3, 0.01, 0.01);
  slider2.position(10, 30);
  slider2.style('width', '80px');
  slider3 = createSlider(-0.3, 0.3, 0.01, 0.01);
  slider3.position(10, 50);
  slider3.style('width', '80px');
}

function draw() {
  background(220);
  //frameRate(5);
  
  push();
  //r
  translate(width/2, height/2);
  strokeWeight(2);
  noFill();
  stroke(20,150);
  ellipse(0,0,2*r,2*r);
  //point(r*cos(step), r*sin(step));
  //r/2
  translate((r+r/2)*cos(step), (r+r/2)*sin(step));
  strokeWeight(2);
  noFill();
  stroke(20,150);
  ellipse(0,0,r,r);
  //point((r/2)*cos(step2), (r/2)*sin(step2));
  //r/4
  translate((r/2+r/4)*cos(step2), (r/2+r/4)*sin(step2));
  strokeWeight(2);
  noFill();
  stroke(20,150);
  ellipse(0,0,r/2,r/2);
  //point((r/4)*cos(step3), (r/4)*sin(step3));
  //r/8
  translate((r/4+r/8)*cos(step3), (r/4+r/8)*sin(step3));
  strokeWeight(2);
  noFill();
  stroke(20,150);
  ellipse(0,0,r/4,r/4);
  //point((r/8)*cos(step4), (r/8)*sin(step4));
  //r/16
  translate((r/8+r/16)*cos(step4), (r/8+r/16)*sin(step4));
  strokeWeight(2);
  noFill();
  stroke(20,150);
  ellipse(0,0,r/8,r/8);
  //point((r/16)*cos(step5), (r/16)*sin(step5));
  //r/16
  translate((r/16+r/32)*cos(step5), (r/16+r/32)*sin(step5));
  strokeWeight(2);
  noFill();
  stroke(20,150);
  ellipse(0,0,r/16,r/16);
  //point((r/32)*cos(step6), (r/32)*sin(step6));
  append(points, [width/2+
                  (r+r/2)*cos(step)+
                  (r/2+r/4)*cos(step2)+
                  (r/4+r/8)*cos(step3)+
                  (r/8+r/16)*cos(step4)+
                  (r/16+r/32)*cos(step5)+
                  (r/32)*cos(step6),
                  height/2+
                  (r+r/2)*sin(step)+
                  (r/2+r/4)*sin(step2)+
                  (r/4+r/8)*sin(step3)+
                  (r/8+r/16)*sin(step4)+
                  (r/16+r/32)*sin(step5)+
                  (r/32)*sin(step6)+
                  (r/32)*sin(step6)]);
  
  pop();
  let tot;
  if(points.length > 800){
    tot = 800;
  } else {
    tot = points.length;
  }
  strokeWeight(2);
  stroke(250,0,0,150);
  for(let i = 0; i<points.length; i++){
    point(points[i][0],points[i][1]);
  }
  
  step += 0.01;
  step2 += slider1.value();
  step3 += slider2.value();
  step4 -= 0.08;
  step5 += slider3.value();
  step6 -= 0.12;


}
