class Ant{

  constructor(x, y, state, dir){
    this.x = x;
    this.y = y;
    this.state = state;
    this.dir = dir;
    //this.move = directions[this.dir];

  }

  show(){
    noStroke();
    fill(255,0,150,150);
    rect(this.x*scl, this.y*scl, scl, scl);

    push();
    translate(this.x*scl + scl/2, this.y*scl + scl/2);
    rotate(this.dir*PI/2);
    stroke(0);
    noFill();
    beginShape(LINES);
    vertex(0, scl/2);
    vertex(0, -scl/2);
    vertex(-scl/4, -scl/2 + scl/5);
    vertex(0, -scl/2);
    vertex(scl/4, -scl/2 + scl/5);
    vertex(0, -scl/2);
    endShape();

    pop();
  }

  check(){
    if(this.state == 0){
      this.dir = (this.dir + 1)%4;
      //this.move = directions[this.dir];
    }else{
      this.dir = (this.dir - 1 + 4)%4;
      //this.move = directions[this.dir];
    }
    this.state = (this.state + 1)%2;
  }

  move(){
    if(this.dir == 0){

      this.y = (this.y - 1 + rows)%rows;

    }else if(this.dir == 1){

      this.x = (this.x + 1)%cols;

    }else if(this.dir == 2){

      this.y = (this.y + 1)%rows;

    }else{

      this.x = (this.x - 1 + cols)%cols;

    }
  }
}
