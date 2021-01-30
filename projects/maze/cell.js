function Cell(x,y){

  this.x = x;
  this.y = y;
  this.walls = [true, true, true, true];
  this.visited = false;


  this.checkNeig = function() {

    var neigs = [];

    var top = grid[index(x, y - 1)];
    var right = grid[index(x + 1, y)];
    var bottom = grid[index(x, y + 1)];
    var left = grid[index(x - 1, y)];

    if(top && !top.visited){
      neigs.push(top);
    }
    if(right && !right.visited){
      neigs.push(right);
    }
    if(bottom && !bottom.visited){
      neigs.push(bottom);
    }
    if(left && !left.visited){
      neigs.push(left);
    }

    if( neigs.length > 0){
      let ind = floor(random(0, neigs.length));
      return neigs[ind];
    }
    else{
      return undefined;
    }


  }
  this.highlight = function() {
    noStroke();
    fill(25,100,200,150);
    rect(x*w,y*w,w,w);
  }

  this.show = function () {
    let x = this.x*w;
    let y = this.y*w;
    stroke("#D4EFDF");
    if (this.walls[0]){
      line(x, y, x + w, y);
    }
    if (this.walls[1]){
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]){
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]){
      line(x, y + w, x, y);
    }

    if(this.visited){
      noStroke();
      let tmp = sqrt(x*x +y*y);
      let col = map(tmp, 0, sqrt(width*width + height*height), 0, 255);

      fill(255,col,50,100);
      rect(x,y,w,w);
    }
  }

}
