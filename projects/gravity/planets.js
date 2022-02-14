class planet{
    constructor(x,y,c){
      this.pos = createVector(x,y);
      this.col = c;
      this.vel = createVector(0,0);
      this.acc = createVector(0,0);
      this.vel_lim = 10;
      this.tail = [];
      this.tail.push(createVector(x,y));
      this.radius = 2;
    }
    
    show(){
      noStroke();
      fill(this.col);
      ellipse(this.pos.x, this.pos.y, this.radius);
      //for(let p of this.tail){
      //  ellipse(p.x, p.y, this.radius);
      //}
    }
    
    update(p,G){
      let dist = p5.Vector.dist(p.pos,this.pos);
      if(dist < 1){
        return;
      }
      let coeff = (p.sign*G)/(dist*dist);
      let dir = p5.Vector.sub(this.pos, p.pos).normalize();
      dir.mult(coeff);
      this.acc.add(dir);
    }
    
    move(){
      this.vel.add(this.acc);
      this.vel.limit(this.vel_lim);
      this.pos.add(this.vel);
      this.tail.push(createVector(this.pos.x, this.pos.y));
      if(this.tail.length > 50){
        this.tail.shift();
      }
      this.acc.set(0,0);
    }
  }