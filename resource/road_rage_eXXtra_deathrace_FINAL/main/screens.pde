//Gameplay screens
//Last update: 0:36 10.01.21

//*********************\\
//**** MAIN SEQUENCE ****\\

void start_screen() {
  reset();
  image(title, 0, 0); 
  fill(100, 0, 100);
  //textSize(40);
  //text("Start", 300, height/3);

  stroke(100, 0, 100);
  fill(0, 150, 150);
  quad(440, 400, 465, 420, 440, 440, 440, 440);
  quad(240, 400, 215, 420, 240, 440, 240, 440);
  switch(car) {
  case 0:
    tint(255, playerOpacity);
    image(img, carX, carY);
    break;
  case 1:
    tint(255, playerOpacity);
    image(img2, carX, carY);
    break;
  }
  if ( car <= 0) {
    car = 0;
  }
}

void gameplay_screen() {
  scoring();
  EnnemyRandomizer();
  collisionTest();
  bonusRandomiser ();
  playerMovement();
  gameOver();
}

void over_screen() {
  //Draw the car
  switch(car) {
  case 0:
    tint(255, playerOpacity);
    image(img, carX, carY);
    break;
  case 1:
    tint(255, playerOpacity);
    image(img2, carX, carY);
    break;
  }

  //Score report and instruction
  fill(100, 0, 100);
  textSize(40);
  text("Game Over", 225, height/3);
  textSize(20);
  text("Press SPACE to play again", 215, 9*height/10);
  textSize(30);
  //text("Click here", 255, height/3+60);
  fill(0);
  text("Score: ", width/2 - 60, 80);
  fill(255, 0, 0);
  text(int(totalScore), width/2 + 40, 80);
}

//*********************\\
//****** FUNCTIONS ******\\

//Function for spawning a bonus with delay at
//a radom location after every spawnCycle
void bonusRandomiser () {
  if (millis() - gameStartTime > 10000) { //delay for 10 seconds after gamestart
    if (millis() - timeStart > spawnCycle) {
      bonus.spawn();
      bonus.move();
      if (bonus.bonusY > height + bonus.bonusSize || bonusDisappear) {
        timeStart = millis();
        bonus = new Bonus(random(200, width-200-bonus.bonusSize), int(random(3)));
      }
    }
  }
}

//Function for spawningobstacles with delay at
//a radom location after every spawnCycle

void EnnemyRandomizer () {
    if (millis() - gameStartTime > 7000) { //delay for 7 seconds after gamestart
    if (millis() - roadblockStart > roadblockCycle) {
      roadblock.spawn();
      roadblock.update();
      if (roadblock.posY >height + 30) {
        roadblockStart = millis();
        roadblock = new Roadblock(-30, random(200, width-200-100), newGlobalSpeed/2 + accelerationRB);
        accelerationRB += 0.0175;
      }
    }
  }
  
  if (millis() - gameStartTime > 1000) { //delay for 1 seconds after gamestart
    if (millis() - chaserStart > chaserCycle) {
      chaser.spawn();
      chaser.update();
      if (chaser.pY >height + 70) {
        chaserStart = millis();
        chaser = new Chaser(-cop.height, random(200, width-200), 0, newGlobalSpeed/1.5 + accelerationCha);
        accelerationCha += 0.0125;
      }
    }
  }

}

//Function for scoring
void scoring() {
  if (screen == 1) {
    totalScore += scoreIncrement/frameRate + bonusScore/(frameRate/2);
  }
  fill(0);
  textSize(50);
  text(int(totalScore), 50, 50);
  
  //Accelerate the newGlobalSpeed
  //newGlobalSpeed += 0.001/frameRate;
}

//Function for testing collision with obstacles
void collisionTest() {
  if (//Collision with roadblocks:
    carX >= roadblock.posX - img.width &&
    carX <= roadblock.posX + block.width && 
    carY >= roadblock.posY - img.height && 
    carY <= roadblock.posY + block.height ||

    //Collision with chaser:
    carX >= chaser.pX - img.width &&
    carX <= chaser.pX + cop.width && 
    carY >= chaser.pY - img.height && 
    carY <= chaser.pY + cop.height) {

    //only true if invisible effect isn't taking place  
    if (invisible) collision = false;
    else collision = true;
  } else collision = false;
  //println(collision+"; "+gameStartTime);
}

//Function to change to game over screen
void gameOver() {
  if (collision) {
    screen = 2;
  }
}


//Function to reset all values
void reset() {
  if (screen == 0) {
    carX = 318;
    carY = 400;
    roadblock.posY = height + 30;
    bonus.bonusY = height+30;
    chaser.pY = height + 70;
    collision = false;
    totalScore = 0;
    bonusScore = 0;
    newGlobalSpeed = globalSpeed;
    accelerationRB = 0;
    accelerationCha = 0;
  }
}
