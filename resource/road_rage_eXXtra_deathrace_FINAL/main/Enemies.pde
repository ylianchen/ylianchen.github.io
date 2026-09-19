//Create 2 types of obstacles: roadblocks and chaser
//which can be randomly spawned to the street

class Roadblock{
   boolean Onscreen = false;
   float posY,posX,VY;
   //float roadblockW = 100;
   //float roadblockH = 30;
   
     Roadblock(float y,float x, float vy){
       posY = y;
       posX = x;
       VY = vy;
     }
     
       void update(){
         posY += VY ;//+ acceleration;

       }
       
       void spawn() {
       image(block, posX, posY);
     }
}


class Chaser{
  boolean onScreen = false;
  float pY,pX,VX,VY;
    Chaser( float y ,float x, float vx,float vy){
      pY = y;
      pX = x;
      VX= vx;
      VY= vy;
      }
      
      void update(){
        pY += VY ;//+ acceleration;
        float targetX = carX;
        float dx = targetX - pX;
        pX += dx * easing;
        
      }
      void spawn(){
        if (onScreen == false) {
          image(cop,pX,pY);

        } 

      }
}
