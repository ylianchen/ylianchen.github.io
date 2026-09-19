// js/classes/Player.js
class Player {
    constructor(assetLoader) {
        this.assets = assetLoader.assets;
        this.selectedCar = 0;
        this.reset();
    }

    reset() {
        this.x = width ? width / 2 - 25 : 315;
        this.y = height ? height - 160 : 520;
        this.vx = 0;
        this.vy = 0;
        this.speed = 3.5;
        this.opacity = 255;
    }

    move() {
        this.vx = 0;
        this.vy = 0;
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.vy -= this.speed;
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.vy += this.speed;
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.vx -= this.speed;
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.vx += this.speed;

        this.y += this.vy;
        this.x += this.vx;
        this.constrainPosition();
    }

    constrainPosition() {
        this.y = constrain(this.y, 80, height - 100);
        this.x = constrain(this.x, 160, 520 - 50);
    }
    display() {
        push();
        tint(255, this.opacity);
        const carImage = this.selectedCar === 0 ? this.assets.cars.player1 : this.assets.cars.player2;
        image(carImage, this.x, this.y);
        pop();
        
        this.drawTurbulence();
    }
    drawTurbulence() {
        const x = random(this.x, this.x + 27);
        const y1 = random(this.y + 50, height);
        const y2 = random(this.y + 50, height);
        stroke(255, 180);
        line(x, y1, x, y2);
    }

    handleKeyPress(keyCode) {
        switch(keyCode) {
            case UP_ARROW:
                this.vy = -this.speed;
                break;
            case DOWN_ARROW:
                this.vy = this.speed;
                break;
            case LEFT_ARROW:
                this.vx = -this.speed;
                break;
            case RIGHT_ARROW:
                this.vx = this.speed;
                break;
        }
    }

    handleKeyRelease() {
        if (this.vx !== 0) {
            this.vx *= 0.8;
            this.vy *= 0.8;
        }
    }
}