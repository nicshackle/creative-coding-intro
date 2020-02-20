class Particle {
  PVector location;
  PVector velocity;
  PVector acceleration;
  int band;
  float lifespan;
  int alph;
  
  Particle(PVector l) {
    acceleration = new PVector(0, 0);
    location = l.get();
    velocity = new PVector(random(-0.01, 0.01), random(-0.01, 0.01));
    lifespan = 1000;
    band = int(random(0, 255));
    alph = int(random(30,255));

  }

  void run() {
    update();
    display();
  }

  void update() {

    float x_inf = (fft.getBand(band)*log(band+1)*gain/100);
    float y_inf = (fft.getBand(band)*log(band+1)*gain/100);
    
    //float x_inf = random(0,0.1)*gain;
    //float y_inf = random(0,0.1)*gain;
    
    float x_magnet=0;
    float y_magnet=0;
    int range=(int)random(50,500); //zone around the mouse that draw particles in
    if(location.x<(x2+range) && location.x>(x2-range) && location.y<(y2+range) && location.y>(y2-range)){ //if particle is in range of zone
    if(x2>=location.x) x_magnet = random(0, 0.01);
    if(x2<=location.x) x_magnet = random(-0.01, 0);
    
    if(y2>=location.y) y_magnet = random(0, 0.01);
    if(y2<=location.y) y_magnet = random(-0.01, 0);
    }
    
    //float xdiff
    
    //if(mouseX>=location.x) x_magnet = -random(0,mouseX-location.x);
    //if(mouseX<=location.x) x_magnet =  random(0,location.x-mouseX);
    
    //if(mouseY>=location.y) y_magnet = random(0, 0.01);
    //if(mouseY<=location.y) y_magnet = random(-0.01, 0);
    
    PVector  influence = new PVector(random(-x_inf, x_inf), random(-y_inf, y_inf));
    
    PVector  magnet = new PVector(x_magnet,y_magnet);

    location.add(velocity);
    velocity.add(acceleration);
    velocity.add(influence);
    velocity.add(magnet);
    lifespan = lifespan-(1+(1/100.0));
  }

  void display() {
    
    stroke(alph);
    strokeWeight(3);
    point(location.x, location.y);
    
  }

  boolean isDead() {
    if (lifespan <0.0) {
      return true;
    } else {
      return false;
    }
  }
}
