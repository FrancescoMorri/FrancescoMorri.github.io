class magnets {
    constructor(x,y,sign){
      this.pos = createVector(x,y);
      this.sign = sign;
    }
    show(){
      noStroke();
      if (this.sign == -1){
        fill(255,0,0);
      } else {
        fill(0,0,255);
      }
      ellipse(this.pos.x, this.pos.y, 10, 10);
  }
}