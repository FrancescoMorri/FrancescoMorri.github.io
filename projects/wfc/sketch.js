var grid = [];
var good_indexes = [];
var numrow = 50;
var numcol = 50;
var rowwidth;
var colwidth;
var states = ['0','1','2','3','4'];
var rules = {"0":['0','1'],
             "1":['1','0','2'],
             "2":['2','1','3'],
             "3":['3','2','4'],
             "4":['4','3']};
var colors = {"0":[109,109,109],
              "1":[98,82,28],
              "2":[30,111,27],
              "3":[232,220,140],
              "4":[71,152,222]};

function setup() {
  cnv = createCanvas(500, 500);
  cnv.parent('container');
  cnv.mouseClicked(fixel);
  rowwidth = height/numrow;
  colwidth = width/numcol;
  
  for(let j = 0; j<numrow; j++){
    for(let i = 0; i<numcol; i++){
      //let s = states;
      grid[i+j*numcol] = new voxels(['0','1','2','3','4'],i,j);
      good_indexes[i+j*numcol] = i+j*numcol;
    }
  }
  background(220);
}

function draw() {
  //frameRate(15);
  let stop = 0;
  for(const l of good_indexes){
    //print(l);
    grid[l].draw(rowwidth,colwidth,colors);
  }

  let low_l = random(good_indexes);
  let ent = 10;
  let removal = [];
  for(const l of good_indexes){
    let neigh;
    let tot_states = 0;
    //top left
    if(l == 0){
      neigh = [grid[l+1],grid[l+numcol]];
    }
    //top right
    else if(l == numcol-1){
      neigh = [grid[l-1],grid[l+numcol]];
    }
    //bottom left
    else if(l == numcol*(numrow-1)){
      neigh = [grid[l+1],grid[l-numcol]];
    }
    //bottom right
    else if(l == numcol*numrow-1){
      neigh = [grid[l-1],grid[l-numcol]];
    }
    //left border
    else if(l%numcol == 0){
      neigh = [grid[l+1],grid[l-numcol],grid[l+numcol]];
    }
    //right border
    else if((l+1)%numcol == 0){
      neigh = [grid[l-1],grid[l-numcol],grid[l+numcol]];
    }
    //top border
    else if(l > 0 && l < numcol-1){
      neigh = [grid[l-1],grid[l+numcol],grid[l+1]];
    }
    //bottom border
    else if(l > numcol*(numrow-1) && l < numcol*numrow-1){
      neigh = [grid[l-1],grid[l-numcol],grid[l+1]];
    }
    else{
      neigh = [grid[l+1],grid[l-1],grid[l+numcol],grid[l-numcol]];
    }
    
    //print(neigh);  
    tot_states = give_state(neigh);
    tot_states += grid[l].state;
    stop += grid[l].state;
    grid[l].check_neigh(neigh, rules);
    let ne = grid[l].update_ent();
    if(ne < ent){
      ent = ne;
      low_l = l;
    }
    if(tot_states == 0){
      append(removal,l);
    }
  }
  for(const r of removal){
    let i = good_indexes.indexOf(r);
    good_indexes.splice(i,1);
  }
  if(stop == 0){
    noLoop();
  }
  //noLoop();
  if(low_l === undefined){
    noLoop();
  }
  else{
    grid[low_l].choose_rand_state();
  }
  
  
}

function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
}

function fixel(){
  let ix = floor(mouseX/rowwidth);
  let iy = floor(mouseY/colwidth);
  grid[ix+iy*numcol].choose_rand_state();
  
}

function give_state(voxels){
  let tot = 0;
  for(const v of voxels){
    tot += v.state;
  }
  return tot;
}