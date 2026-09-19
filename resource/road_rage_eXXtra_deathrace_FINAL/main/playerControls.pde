void playerMovement() {
  // Dislay, move, and restrain the car
  carY = carY + carVY/frameRate;
  carX = carX + carVX/frameRate;
  if (carY<100) {
    carY=100;
  } else if (carY>height-50-100) {
    carY=height-50-100;
  } else if (carX>520-50) {
    carX=520-50;
  } else if (carX<160) {
    carX=160;
  }
  switch(car) {
  case 0:
    tint(255, playerOpacity);
    image(img, carX, carY);
    tint(255, 255);
    x=random(carX, carX+50);
    y1=random(carY, height);
    y2=random(carY, height);
    stroke(255);
    line(x, y1, x, y2);
    break;
  case 1:
    tint(255, playerOpacity);
    image(img2, carX, carY);
    tint(255, 255);
    x=random(carX, carX+50);
    y1=random(carY, height);
    y2=random(carY, height);
    stroke(255);
    line(x, y1, x, y2);
    break;
  }
}

void playerControls() {
  if (keyCode==UP) {
    carVY=-carSpeed;
  } else if (keyCode==DOWN) {
    carVY=+carSpeed;
  } else if (keyCode==LEFT) {
    carVX=-carSpeed;
  } else if (keyCode==RIGHT) {
    carVX=+carSpeed;
  }
}
