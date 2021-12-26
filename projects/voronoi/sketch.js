var points = [];
var color_count = [];
var grid = [];
var dist_data = [];
var scaling = 1;
var colors = [];
var N_points = 2; //number for starting
var cnv;

function setup() {
  cnv = createCanvas(300, 300);
  cnv.parent('container');
  pixelDensity(scaling);
  
  init_grid();
  init_points();
  first_computation();
  
  
}

function draw() {
  
  cnv.mouseClicked(function(){new_point();});
  loadPixels();
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var pix = (x + y * width) * 4;
      var c = grid[x][y];
      //c = constrain(c, 0, 255);
      pixels[pix + 0] = c[0];
      pixels[pix + 1] = c[1];
      pixels[pix + 2] = c[2];
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
  for(let i = 0; i < N_points; i++){
    fill(colors[i]);
    stroke(0);
    ellipse(points[i].x, points[i].y, 10);
    /*if(i < N_points-1)
      {
        for(let j = i+1; j < N_points; j++){
          let m = dist_data[i][j][0];
          let c = dist_data[i][j][1];
          stroke(0);
          line(0, compute_line(c,m,0),
               width, compute_line(c,m,width));
        }
      }*/
  }
  
}

function compute_line(c,m,x){
  return c+m*x;
}

function init_grid(){
  //initialize grid
  for(let i = 0; i < width/scaling; i++){
    grid[i] = [];
    for(let j = 0; j < height/scaling; j++){
      grid[i][j] = color(220);
    }
  }
}

function init_points(){
  
  //initiliaze point related stuff
  for(let i = 0; i < N_points; i++){
    points[i] = createVector(random(0,width), random(0,height));
    color_count[i] = 0;
    colors[i] = [map(i, 0, N_points, 0, 255),
                      random(0,255),
                      random(0,255)];
    dist_data[i] = [];
    for(let j = 0; j < N_points; j++){
      dist_data[i][j] = [0,0];
    }
  }
}

function first_computation(){
  //compute lines
  for(let i = 0; i < N_points; i++){
    if(i < N_points-1){
        for(let j = i+1; j < N_points; j++){
          let middle_point = createVector(
            lerp(points[i].x,points[j].x,0.5),
            lerp(points[i].y,points[j].y, 0.5)
          );
          let conj = p5.Vector.sub(points[i], points[j]);
          let perp = conj.rotate(PI/2);
          let m = perp.y/perp.x;
          let c = middle_point.y-m*middle_point.x;
          dist_data[i][j] = [m, c];
        }
      }
  }
  //compute colors
  for(let j = 0; j < height/scaling; j++){
    
    for(let i = 0; i < width/scaling; i++){
      
      for(let i_p = 0; i_p < N_points; i_p++){
        
        if(i_p < N_points-1){
          
          for(let j_p = i_p+1; j_p < N_points; j_p++){
            
            var x_grid = i*scaling;
            var y_grid = j*scaling;
            
            var intercept = (y_grid - dist_data[i_p][j_p][1])/dist_data[i_p][j_p][0];
            var point_i_int = (points[i_p].y - dist_data[i_p][j_p][1])/dist_data[i_p][j_p][0];
            var point_j_int = (points[j_p].y - dist_data[i_p][j_p][1])/dist_data[i_p][j_p][0];

            if(x_grid < intercept && points[i_p].x < point_i_int){
              
              color_count[i_p] += 1;
            } else if(x_grid < intercept && points[j_p].x < point_j_int){
              
              color_count[j_p] += 1;
            } else if(i > intercept && points[i_p].x > point_i_int){
              
              color_count[i_p] += 1;
            } else if(x_grid > intercept && points[j_p].x > point_j_int){
              
              color_count[j_p] += 1;
            }
          }
        }
      }
      var max_color = 0;
      var max_index = 0;
      for(let iter = 0; iter < N_points; iter++){
        
        if(color_count[iter] > max_color){
          
          max_color = color_count[iter];
          max_index = iter;
        }
      }
      for(let iter = 0; iter < N_points; iter++){
        
        color_count[iter] = 0;
      }
      grid[i][j] = colors[max_index];
    }
  }
}

function new_point(){
  
  //add new point from mouse
  N_points += 1;
  var x = mouseX;
  var y = mouseY;
  var new_point = createVector(x,y);
  points.push(new_point);
  color_count.push(0);
  colors.push([map(N_points-1, 0, N_points, 0, 255),
                      random(0,255),
                      random(0,255)]);
  
  for(let i = 0; i < N_points; i++){
    dist_data[i] = [];
    for(let j = 0; j < N_points; j++){
      dist_data[i][j] = [0,0];
    }
  }
  
  
  for(let i = 0; i < N_points; i++){
    if(i < N_points-1){
        for(let j = i+1; j < N_points; j++){
          let middle_point = createVector(
            lerp(points[i].x,points[j].x,0.5),
            lerp(points[i].y,points[j].y, 0.5)
          );
          let conj = p5.Vector.sub(points[i], points[j]);
          let perp = conj.rotate(PI/2);
          let m = perp.y/perp.x;
          let c = middle_point.y-m*middle_point.x;
          dist_data[i][j] = [m, c];
        }
      }
  }
  //compute colors
  for(let j = 0; j < height/scaling; j++){
    
    for(let i = 0; i < width/scaling; i++){
      
      for(let i_p = 0; i_p < N_points; i_p++){
        
        if(i_p < N_points-1){
          
          for(let j_p = i_p+1; j_p < N_points; j_p++){
            
            var x_grid = i*scaling;
            var y_grid = j*scaling;
            
            var intercept = (y_grid - dist_data[i_p][j_p][1])/dist_data[i_p][j_p][0];
            var point_i_int = (points[i_p].y - dist_data[i_p][j_p][1])/dist_data[i_p][j_p][0];
            var point_j_int = (points[j_p].y - dist_data[i_p][j_p][1])/dist_data[i_p][j_p][0];

            if(x_grid < intercept && points[i_p].x < point_i_int){
              
              color_count[i_p] += 1;
            } else if(x_grid < intercept && points[j_p].x < point_j_int){
              
              color_count[j_p] += 1;
            } else if(i > intercept && points[i_p].x > point_i_int){
              
              color_count[i_p] += 1;
            } else if(x_grid > intercept && points[j_p].x > point_j_int){
              
              color_count[j_p] += 1;
            }
          }
        }
      }
      var max_color = 0;
      var max_index = 0;
      for(let iter = 0; iter < N_points; iter++){
        
        if(color_count[iter] > max_color){
          
          max_color = color_count[iter];
          max_index = iter;
        }
      }
      for(let iter = 0; iter < N_points; iter++){
        
        color_count[iter] = 0;
      }
      grid[i][j] = colors[max_index];
    }
  }
}

