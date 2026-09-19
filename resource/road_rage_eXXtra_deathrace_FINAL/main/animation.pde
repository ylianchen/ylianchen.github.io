//Display and cycle the background animation
//Last update 23:00 03.01.21

class Animation {
  float x;  // location for Animation
  float y;  // location for Animation

  float index = 0; 

  // Speed, this will control both the animations movement
  // as well as how fast it cycles through the images
  float speed;

  // The array of images
  PImage[] images;

  Animation(PImage[] images_, float x_, float y_) {
    images = images_;
    x = x_;
    y = y_;

    // A speed
    speed = newGlobalSpeed*4;
    // Starting at the beginning
    index = 0;
  }

  void display() {
    // Must convert the float index to an int first
    int imageIndex = int(index);
    image(images[imageIndex], 0, 0);
  }

  void move() {
    speed = newGlobalSpeed*4;
    y += speed;
  }


  void next() {
    // Move the index forward in the animation sequence
    index += speed;
    // If we are at the end, go back to the beginning
    if (index >= images.length) {
      // We could just say index = 0
      // but this is slightly more accurate
      index -= images.length;
    }
  }
}
