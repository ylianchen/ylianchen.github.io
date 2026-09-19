//This class will create an Bonus object
//that can be spawned to a random location
//and disappear and trigger effects if
//acquire by player's car.

//Cuong Huy Le Nguyen
//Last update: 22:00, 07.01.21

class Bonus {
  //bonus icon properties
  float bonusSize = 30;
  float bonusX;
  float bonusY = -bonusSize;
  float bonusSpeed = newGlobalSpeed/2; //adjust to change how fast the bonus moves
  PImage[] bonusIcon = new PImage[3];
  int bonusType; //code for bonus types

  boolean bonusDisappear = false;

  //Argument inputs for Bonus objects
  //x: bonus location, i: bonus type
  Bonus(float x, int i) {
    bonusX = x;
    bonusType = i;

    //Import bonus icons
    //!!temporal images, replace with actual graphics!!
    bonusIcon[0] = loadImage("bonus/star.png"); //points influx
    bonusIcon[1] = loadImage("bonus/star1.png"); //slow down
    bonusIcon[2] = loadImage("bonus/star2.png"); //unbreakable
  }


  //MAIN FUNCTION
  //Function to spawn the bonus icon at a random location
  void spawn() {
    bonusAcquire();
    if (bonusDisappear) {
      bonusY = height+30;
      bonusEffect();
      bonusDisappear = !bonusDisappear;
    } else {
      image(bonusIcon[bonusType], bonusX, bonusY, bonusSize, bonusSize);
      bonusScore = 0;
    }
    disableBonusEffect();
  }


  //SUPPORTING FUNCTIONS
  
  //Function to test for bonus acquisition
  void bonusAcquire() {
    if (carX >= bonusX - img.width
      && carX <= bonusX + bonusSize
      && carY >= bonusY - img.height
      && carY <= bonusY + bonusSize) {
      bonusDisappear = !bonusDisappear;
    }
  }


  //Function to translate bonus icon downwards
  void move() {
    bonusAcquire();
    if (!bonusDisappear) {
      bonusY += bonusSpeed;
    } else {
      bonusSpeed = newGlobalSpeed/2;
    }
  }

  //Function to activate bonus effects
  void bonusEffect() {
    //Type 1: Points influx
    if (bonusType == 0) {
      bonusScore = scoreIncrement*2;
    }

    //Type 2: Slow down time
    if (bonusType == 1) {
      bonusBegin = millis();
      newGlobalSpeed = globalSpeed/2;
      scoreIncrement = 0.0025;
    }

    //Type 3: Invisible
    if (bonusType == 2) {
      bonusBegin = millis();
      playerOpacity = 128;
      invisible = true;
    } 

  }

  //Function to DEactivate bonus effects
  //!PROBLEM: newGlobalSpeed only returns to normal 
  //after the current bonus disappears from screen
  void disableBonusEffect() {
    if (millis() - bonusBegin > bonusLength) {
      newGlobalSpeed = globalSpeed;
      scoreIncrement = 0.005;
      playerOpacity = 255;
      invisible = false;
    }
  }
}
