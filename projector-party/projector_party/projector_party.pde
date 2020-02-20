import java.util.Iterator;

import ddf.minim.analysis.*;
import ddf.minim.*;

import processing.serial.*;
Serial myPort;

Minim minim;
AudioInput in;
FFT fft;

int buffer_size = 1024;  // also sets FFT size (frequency resolution)
float sample_rate = 44100;

Particle p;
ArrayList<Particle> particles = new ArrayList<Particle>();

void setup() {
  size(displayWidth, displayHeight,P2D);
  //fullScreen(P2D,1);
  frameRate(120);
  smooth();

 // myPort = new Serial(this, Serial.list()[2], 19200);

  minim = new Minim(this);

  in = minim.getLineIn(Minim.MONO, buffer_size, sample_rate);
  fft = new FFT(in.bufferSize(), in.sampleRate());
  fft.logAverages(5, 512);
  fft.window(FFT.HAMMING);

  fill(0);
  stroke(255);
  //noCursor();
  
  //myPort.bufferUntil(10);
}
int x1=0;
int x2=0;
int y1=0;
int y2=0;
boolean clicked=false;
float gain=1.0;
void draw() {

  
  
  if(clicked){
  x2=mouseX;
  y2=mouseY;
  }
  else{
  x1=mouseX;
  y1=mouseY;
  }

  if (x1==0 || x1 ==width) { 
    //x1=(int)random(0, width);
  }
  if (y1==0 || y1 ==height) { 
    //y1=(int)random(0, height);
  }


  fill(0, 50);
  stroke(0);
  rect(0, 0, width, height);
  //stroke(255);
  fft.forward(in.mix);




  for (int i=0; i<4; i++) {
    //particles.add(new Particle(new PVector(random(0, width), random(0, height)) ));
    particles.add(new Particle(new PVector(x1, y1)));
  }



  Iterator<Particle> it = particles.iterator();

  while (it.hasNext()) {
    Particle p = it.next();
    p.run();
    if (p.isDead()) {
      it.remove();
    }
  }

  noFill();
  stroke(255);
  ellipse(x2, y2, 100, 100);
  fill(255);
  text("pick up the two controllers on the projector, point them towards the black 'eye', and move them around...",100,height-100);
}

void mouseClicked(){
  clicked=!clicked;
}

void keyPressed(){
  if(key=='w'){
    gain+=0.1;
  }
  if(key=='s'){
    gain-=0.1;
  }
  println("gain at"+ gain);
}


void stop()
{
  // always close Minim audio classes when you finish with them
  in.close();
  minim.stop();

  super.stop();
}

void serialEvent(Serial p){
  String myString = p.readString();
  if (myString != null) {
    int[] output = int (split(myString, ','));

    //println(myString); // display the incoming string
    try {
       x1 = (int)map(output[0], 0, 1023, width, 0);
      y1 = (int)map(output[1], 0, 1023, 0, height);

      x2 = (int)map(output[2], 0, 1023, width, 0);
      y2 = (int)map(output[3], 0, 1023, 0, height);
      
      if(output[0]==0 || output[0]==1023) x1 = width/2;
      if(output[1]==0 || output[1]==1023) y1 = height/2;

    }
    catch(Exception e) {
    }
  }
}
