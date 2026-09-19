//Last update 0:36 10.01.21

//Global variables
Animation[] animations = new Animation[68]; //background img array 
float globalSpeed = 0.5; //Global speed for all moving elements
float newGlobalSpeed = globalSpeed; //speed while bonus takes effect
PImage title;
int screen = 0; //which screen is displayed
boolean collision = false; //collision with obstacles
int gameStartTime; //time when game begins

//Variables for player's car
int car; //car number
float carX, carY; //car location
float carVX=0, carVY=0, carSpeed=1.2; //car speed
PImage img; //car.png
PImage img2;
PImage cap; //cloud maybe
float x, y1, y2; //turbulance line behind the car

//Variables for bonuses
Bonus bonus;
int timeStart;
int spawnCycle = 7000; //interval between bonuses
boolean bonusDisappear = false;
int bonusBegin; //timer for bonus effect
int bonusLength = 7000; //how long the bonus effects last
int playerOpacity = 255; //change the look of player's car
boolean invisible = false;

//Variables for obstacles
Chaser chaser;
PImage cop;
float easing = 0.00075;
int chaserStart; //timer for chaser spawn
int chaserCycle = 3000; //interval between spawns
float accelerationCha;

Roadblock roadblock;
PImage block;
int roadblockStart; //timer for roadblock spawn
int roadblockCycle = 2000; //interval between spawns
float accelerationRB;


//Variables for scoring
float scoreIncrement = 0.005;
float totalScore;
float bonusScore;


void setup() {
  size(680, 680);
  frameRate(60);

  //Initialisation for bonus
  timeStart = millis();
  bonus = new Bonus(random(200, width-230), int(random(3)));

  //Intialize ennemies
  chaser = new Chaser(0, random(200, width-200), 0, 0.5);
  roadblock = new Roadblock(0, random(200, width-200 - 100), 0.2);
  block = loadImage("car/block2.png");
  block.resize(130, 30);
  chaserStart = millis();
  roadblockStart = millis();


  //Initialisation for player's car
  img = loadImage("car/car1.png"); //load car img
  img2 = loadImage("car/car2.png"); 
  cop = loadImage("car/copo.png"); 
  //cap = loadImage("cap.png"); this is for the cloud shadow maybe

  // Load the background image sequence
  title = loadImage("Title/Title.png");
  PImage[] seq = new PImage[68];
  for (int i = 0; i < seq.length; i++) {
    seq[i] = loadImage("data/stick"+nf(i+1, 2)+".jpg");
  }
  // Make the objects
  for (int i = 0; i < animations.length; i ++ ) {
    // Each object gets an image array and an x,y location
    animations[i] = new Animation(seq, 0, 0);
  }
}

void draw() {

  // Display, cycle, and move all the animation objects
  for (int i = 0; i < animations.length; i ++ ) {
    animations[i].display();
    animations[i].next();
    animations[i].move();

    //cload();
    switch(screen) {
    case 0:
      start_screen();
      break;
    case 1:
      gameplay_screen();
      break;
    case 2:
      over_screen();
    }
  }
}
void keyPressed() {
  //Start screen
  if (screen == 0) {
    if (key == ' ') {
      screen = 1;
      gameStartTime = millis();
    }
  }

  //Gameplay screen
  if (screen == 1) playerControls();

  //Game over screen
  if (screen == 2) {
    if (key == ' ') screen = 0;
  }
}

void keyReleased() {
  //Gameplay screen
  if (screen == 1) {
    carVX=0;
    carVY=0;
  }
} 

void mousePressed() {
  if (screen == 0) {
    if (mouseX < 380 && mouseX > 300 && mouseY < 226 && mouseY > 186) {
      screen = 1;
      gameStartTime = millis();
    }
    if (mouseX < 240 && mouseX > 215 && mouseY < 440 && mouseY > 400) {
      car --;
    }
    if (mouseX < 465 && mouseX > 440 && mouseY < 440 && mouseY > 400) {
      car ++;
    }
    if (car < 0) car = 1;
    if (car > 1) car = 0;
  }
}
