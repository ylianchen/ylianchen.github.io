// js/classes/Bonus.js
class Bonus {
    constructor(x, type, speed, assets) {
        this.size = 32;
        this.x = x;
        this.y = -this.size;
        this.speed = speed || (CONFIG.GAME.BONUS.BASE_SPEED || 3.8);
        this.type = type;
        this.isCollected = false;
        this.assets = assets;
        this.icons = [
            assets.bonus.star,
            assets.bonus.star1,
            assets.bonus.star2
        ];
        this.onScreen = true;
    }

    update() {
        if (!this.isCollected) {
            // Speed scales dynamically with slow-motion if active
            const speedMultiplier = (typeof newGlobalSpeed !== 'undefined' && typeof globalSpeed !== 'undefined' && globalSpeed > 0)
                ? (newGlobalSpeed / globalSpeed) : 1;
            this.y += this.speed * speedMultiplier;
            if (this.y > height + 50) {
                this.onScreen = false;
            }
        }
    }

    display() {
        if (!this.isCollected && this.icons[this.type]) {
            image(this.icons[this.type], this.x, this.y, this.size, this.size);
        }
    }

    checkCollection(player) {
        const pW = 27;
        const pH = 57;
        if (!this.isCollected && this.onScreen &&
            player.x < this.x + this.size &&
            player.x + pW > this.x &&
            player.y < this.y + this.size &&
            player.y + pH > this.y) {
            this.isCollected = true;
            this.onScreen = false;
            if (typeof applyBonusEffect === 'function') {
                applyBonusEffect(this.type);
            }
        }
    }
}