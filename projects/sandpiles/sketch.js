var grid = [];
var max_sand = 5;
var scl = 5;
var color_list = ['#900C3F', '#C70039', '#FF5733', '#FFC300', '#DAF7A6', '#B09104'];

function setup() {
  cnv = createCanvas(400, 400);
  cnv.parent('container');
  cnv.mouseClicked(add_sand);
  for(let i = 0; i < floor(width/scl); i++){
    grid[i] = [];
    for(let j = 0; j < floor(height/scl); j++){
      
      grid[i][j] = 0;
    }
  }
  //grid[floor(width/(2*scl))][floor(height/(2*scl))] = 1000000;
  
}


function draw() {

  render();
  for(let i = 0; i<100; i++){
    update();
  }
  
}

function render(){
  for(let i = 0; i < floor(width/scl); i++){
    for(let j = 0; j < floor(height/scl); j++){
      let col;
      if(grid[i][j] < max_sand + 1){
        col = color_list[grid[i][j]];
      } else {
        col = 0;
      }
      noStroke();
      fill(col);
      rect(i*scl, j*scl, scl, scl);
    }
  }
}

function update(){
  let next_grid = [];
  for(let i = 0; i < floor(width/scl); i++){
    next_grid[i] = [];
    for(let j = 0; j < floor(height/scl); j++){
      
      next_grid[i][j] = 0;
    }
  }
  for(let i = 0; i < floor(width/scl); i++){
    for(let j = 0; j < floor(height/scl); j++){
      
      let num = grid[i][j];
      if(num > max_sand){
        
        next_grid[i][j] += (num - max_sand);
        
        if(i+1 < floor(width/scl)){
          next_grid[i+1][j] ++;
        }
        if(i-1 >= 0){
          next_grid[i-1][j]++;
        }
        if(j+1 < floor(height/scl)){
          next_grid[i][j+1]++;
        }
        if(j+1 >= 0){
          next_grid[i][j-1]++;
        }
      } else {
        next_grid[i][j] += num;
      }
    }
  }
  grid = next_grid;
}

function add_sand(){
  
  let x = floor(mouseX/scl);
  let y = floor(mouseY/scl);
  
  grid[x][y] += 50000;
}