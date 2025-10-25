class ball{
  constructor(x,y,r, velx, vely){
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = velx;
    this.vy = vely;
  }
  
  move(){
    this.x += this.vx;
    this.y += this.vy;
  }
  
  check(){
    if(this.x + this.r >= width || this.x - this.r <= 0){
      this.vx *= -1;
    }
    if(this.y + this.r >= height || this.y - this.r <= 0){
      this.vy *= -1;
    }
  }
  
  show(){
    noFill();
    stroke(0,250,0);
    ellipse(this.x, this.y, this.r*2, this.r*2);
  }
}