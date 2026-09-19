// Animation.js - Highway background loop
class Animation {
    constructor(images, x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.images = images; 
        this.index = 0;
    }

    display() {
        const imageIndex = int(this.index);
        if (this.images && this.images[imageIndex]) {
            image(this.images[imageIndex], this.x, this.y);
        }
    }

    move() {
        // The background frames represent continuous highway motion
    }

    next() {
        if (!this.images || this.images.length === 0) return;
        const currentSpeed = typeof newGlobalSpeed !== 'undefined' ? newGlobalSpeed : 0.5;
        this.index += currentSpeed * 2.5;
        if (this.index >= this.images.length) {
            this.index = this.index % this.images.length;
        }
    }
}