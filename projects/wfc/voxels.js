class voxels{
  constructor(values,i,j){
    this.values = values;
    this.entropy = this.values.length;
    this.state = 1;
    this.indexi = i;
    this.indexj = j;
    
  }
  
  check_neigh(neigh, rules){
    if(neigh.length == 0){
      return 0;
    }
    for(const n of neigh){
      var neigh_vals = n.values;
      for(const current_state of this.values){
        let out = true;
        for(const state of neigh_vals){
          var accepted = rules[state];
        
          if(accepted.includes(current_state) || state == current_state){
            out = false;
            break;
          }
        }
        if(out){
          let i = this.values.indexOf(current_state);
          this.values.splice(i,1);
        }
      }
    }
    return 1;
  }
  
  remove_rand_state(){
    if(this.values.length>0){
      let i = random(0,this.values.length);
      this.values.splice(i,1);
    }
  }
  
  choose_rand_state(){
    if(this.values.length == 0){
      print("Problemmm",this.index);
    }
    let i = random(0,this.values.length);
    let tmp = this.values.splice(i,1);
    this.values = tmp;
  }
  
  update_ent(){
    this.entropy = this.values.length;
    if(this.entropy == 1 && this.state == 1){
      this.state = 0;
      return this.entropy;
    }
    else if(this.entropy == 1 && this.state == 0){
      return 1000;
    }
    else{
      return this.entropy;
    }
    
  }
  
  draw(rw,cw,c){
    var final_c = [0,0,0];
    for(let i = 0; i < this.values.length; i++){
      final_c[0] += c[this.values[i]][0]/this.values.length;
      final_c[1] += c[this.values[i]][1]/this.values.length;
      final_c[2] += c[this.values[i]][2]/this.values.length;
    }
    push();
    translate(this.indexi*rw, this.indexj*cw);
    /*textAlign(CENTER,CENTER);
    textSize(rw);
    for(let l = 0; l<grid[i][j].values.length; l++){
        text(grid[i][j].values[l], rw/2, cw/2);
    }*/
    fill(color(final_c));
    noStroke();
    rect(0,0,rw,cw);
    pop();
  }
}