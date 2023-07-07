class Neuron{
    constructor(x,y,s,l){
      this.x = x;
      this.y = y;
      this.s = s;
      this.neigh_index = l;
    }
    
    draw(c){
      noStroke();
      fill(c);
      rectMode(CENTER);
      square(this.x, this.y, this.s);
    }
    
    euclid_dist(px, py){
      return sqrt((px-this.x)*(px-this.x)+(py-this.y)*(py-this.y));
    }
    
    update(p, a, d){
      this.x -= (1/d)*a*(this.x-p[0]);
      this.y -= (1/d)*a*(this.y-p[1]);
    }
  }