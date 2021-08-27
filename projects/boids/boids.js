class boids {
    constructor(position, velocity, mass) {
      this.position = position;
      this.velocity = velocity;
      this.acceleration = createVector();
      this.mass = mass;
      this.size = map(mass, 10, 100, 5, 25);
      this.radius = 80;
      this.max_speed = 2;
      this.max_force = 0.2;
    }
  
    align(boids) {
      let avg_speed = createVector();
      let count = 0;
      for (let other of boids) {
        if (other != this) {
          let d = p5.Vector.dist(this.position, other.position);
          if (d <= this.radius) {
            avg_speed.add(other.velocity);
            count++;
          }
        }
      }
      let correction = createVector();
      if (count > 0) {
        avg_speed.div(count);
        avg_speed.setMag(this.max_speed);
        correction = avg_speed.sub(this.velocity);
        correction.limit(this.max_force);
      }
      return correction;
    }
    
    center(boids){
      let center_mass = createVector();
      let count = 0;
      for(let other of boids){
        if(other != this){
          let d = p5.Vector.dist(this.position, other.position);
          if(d <= this.radius){
            center_mass.add(other.position);
            count++;
          }
        }
      }
      let correction = createVector();
      if(count > 0){
        center_mass.div(count);
        correction = center_mass.sub(this.position);
        correction.setMag(this.max_speed);
        correction.sub(this.velocity);
        correction.limit(this.max_force);
      }
      return correction;
    }
    
    avoid(boids){
      let avg_avoid = createVector();
      let count = 0;
      for(let other of boids){
        if(other != this){
          let d = p5.Vector.dist(this.position, other.position);
          if(d <= this.radius){
            let pos = this.position.copy();
            let other_pos = other.position.copy();
            let conj = other_pos.sub(pos);
            d = max(d, 0.0000005);
            conj.div(-d*d);
            avg_avoid.add(conj);
            count++;
          }
        }
      }
      let correction = createVector();
      if(count > 0){
        avg_avoid.div(count);
        avg_avoid.setMag(this.max_speed);
        correction = avg_avoid.sub(this.velocity);
        correction.limit(this.max_force);
      }
      return correction;
    }
  
    compute_acc(boids, align_m, center_mass_m, avoid_m) {
      this.acceleration.set(0,0);
      let align = this.align(boids);
      let center_mass = this.center(boids);
      let avoid = this.avoid(boids);
      
      this.acceleration.add(align.mult(align_m));
      this.acceleration.add(center_mass.mult(center_mass_m));
      this.acceleration.add(avoid.mult(avoid_m));
    }
  
    show(col) {
      push();
      translate(this.position.x, this.position.y);
      rotate(this.velocity.heading());
      noStroke();
      fill(col);
      //line(0, 0, 0, this.size);
      triangle(0, 0, this.size, this.size/2, 0, this.size);
      pop();
    }
  
    update() {
      
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.velocity.limit(this.max_speed);
    }
  
    check_edges() {
      if (this.position.x > width) {
        this.position.x = 0;
      } else if (this.position.x < 0) {
        this.position.x = width;
      }
      if (this.position.y > height) {
        this.position.y = 0;
      } else if (this.position.y < 0) {
        this.position.y = height;
      }
    }
  }
  