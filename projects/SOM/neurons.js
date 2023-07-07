class Neuron{
    constructor(x,y,z,s,l){
      this.x = x;
      this.y = y;
      this.z = z;
      this.s = s;
      this.neigh_index = l;
    }
    
    draw(c){
      push();
      translate(this.x, this.y, this.z);
      noStroke();
      fill(c);
      sphere(this.s);
      pop();
    }
    
    euclid_dist(px, py, pz){
      return sqrt((px-this.x)*(px-this.x)+(py-this.y)*(py-this.y)+(pz-this.z)*(pz-this.z));
    }
    
    update(p, a){
      this.x -= a*(this.x-p[0]);
      this.y -= a*(this.y-p[1]);
      this.z -= a*(this.z-p[2]);
    }
  }