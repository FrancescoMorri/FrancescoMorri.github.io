class particles {
    constructor(x, y, vx, vy, t, o) {
      this.pos = createVector(x, y);
      this.vel = createVector(vx, vy);
      this.acc = createVector(0, 0);
      this.theta = t;
      this.omega = o;
      this.radius = 10;
      this.maxF = 0.03;
      this.coheD = 25;
      this.alignD = 30;
      this.avoidD = 20;
      this.kuraD = 30;
      this.maxV = 2;
    }
  
    show() {
      var c = abs(floor(map(sin(this.theta), -1, 1, 0, 255)));
      fill(255, 100, c);
      ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    }
  
    update(ps, c, av, al, K) {
      // Kuramoto update
      this.theta += this.omega + this.kuramoto(ps, K);
      // Boids updates
      let choesion = this.cohesion(ps);
      let avoidance = this.avoidance(ps);
      let alignment = this.alignment(ps);
  
      choesion.mult(c);
      avoidance.mult(av);
      alignment.mult(al);
  
      this.acc.add(choesion);
      this.acc.add(avoidance);
      this.acc.add(alignment);
  
      this.vel.add(this.acc);
      this.vel.limit(this.maxV);
      this.pos.add(this.vel);
  
      this.acc.mult(0);
    }
  
    borders() {
      if (this.pos.x < -this.radius) this.pos.x = width + this.radius;
      if (this.pos.y < -this.radius) this.pos.y = height + this.radius;
      if (this.pos.x > width + this.radius) this.pos.x = -this.radius;
      if (this.pos.y > height + this.radius) this.pos.y = -this.radius;
    }
  
    cohesion(ps) {
      var steer = createVector(0, 0);
      var com = createVector(0, 0);
      var count = 0;
      for (let p of ps) {
        let d = p5.Vector.dist(this.pos, p.pos);
        if (d > 0 && d < this.coheD) {
          com.add(p.pos);
          count++;
        }
      }
      if (count > 0) {
        com.div(count);
        let target = p5.Vector.sub(com, this.pos);
        target.setMag(this.maxV);
        steer = p5.Vector.sub(target, this.vel);
        steer.limit(this.maxF);
      }
      return steer;
    }
  
    avoidance(ps) {
      let steer = createVector(0, 0);
      let count = 0;
      for (let p of ps) {
        let d = p5.Vector.dist(this.pos, p.pos);
        if (d > 0 && d < this.avoidD) {
          let diff = p5.Vector.sub(this.pos, p.pos);
          diff.normalize();
          diff.div(d);
          steer.add(diff);
          count++;
        }
      }
      if (count > 0) {
        steer.div(count);
      }
      if (steer.mag() > 0) {
        steer.setMag(this.maxV);
        steer.sub(this.vel);
        steer.limit(this.maxF);
      }
      return steer;
    }
  
    alignment(ps) {
      let steer = createVector(0, 0);
      let avg_vel = createVector(0, 0);
      let count = 0;
      for (let p of ps) {
        let d = p5.Vector.dist(this.pos, p.pos);
        if (d > 0 && d < this.alignD) {
          avg_vel.add(p.vel);
          count++;
        }
      }
      if (count > 0) {
        avg_vel.div(count);
        avg_vel.setMag(this.maxV);
        let target = p5.Vector.sub(avg_vel, this.vel);
        target.setMag(this.maxV);
        steer = p5.Vector.sub(target, this.vel);
        steer.limit(this.maxF);
      }
      return steer;
    }
  
    kuramoto(ns, K) {
      let new_omega = 0;
      let count = 0;
      for (let n of ns) {
        let d = p5.Vector.dist(this.pos, n.pos);
        if (d > 0 && d < this.kuraD) {
          count++;
          new_omega += sin(n.theta - this.theta);
        }
      }
      if (count > 0) {
        new_omega = new_omega * (K / count);
      }
      return new_omega;
    }
  }
  