// js/utils/AssetLoader.js
class AssetLoader {
    constructor() {
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.assets = {
            cars: {},
            bonus: {},
            animations: []
        };
    }

    updateLoadingProgress() {
        const el = document.getElementById('loading-screen');
        if (!el) return;
        const progress = this.totalAssets > 0 ? Math.floor((this.loadedAssets / this.totalAssets) * 100) : 100;
        el.innerHTML = `Loading... ${progress}%`;
        if (this.loadedAssets >= this.totalAssets) {
            el.style.display = 'none';
        }
    }

    loadImage(path) {
        this.totalAssets++;
        const pImg = new p5.Image(1, 1);
        const img = new Image();

        const onFinish = (success) => {
            if (success) {
                pImg.width = pImg.canvas.width = img.naturalWidth || img.width;
                pImg.height = pImg.canvas.height = img.naturalHeight || img.height;
                pImg.drawingContext.drawImage(img, 0, 0);
                pImg.modified = true;
            }
            this.loadedAssets++;
            this.updateLoadingProgress();
        };

        img.onload = () => onFinish(true);
        img.onerror = (err) => {
            console.warn('Image failed to load:', path);
            onFinish(false);
        };
        img.src = path;
        return pImg;
    }

    loadGameAssets() {
        // Load car images
        this.assets.cars.player1 = this.loadImage(`${CONFIG.PATHS.IMAGES.CAR}car1.png`);
        this.assets.cars.player2 = this.loadImage(`${CONFIG.PATHS.IMAGES.CAR}car2.png`);
        this.assets.cars.cop = this.loadImage(`${CONFIG.PATHS.IMAGES.CAR}cop.png`);
        this.assets.cars.block = this.loadImage(`${CONFIG.PATHS.IMAGES.CAR}block2.png`);

        // Load bonus images
        this.assets.bonus.star = this.loadImage(`${CONFIG.PATHS.IMAGES.BONUS}star.png`);
        this.assets.bonus.star1 = this.loadImage(`${CONFIG.PATHS.IMAGES.BONUS}star1.png`);
        this.assets.bonus.star2 = this.loadImage(`${CONFIG.PATHS.IMAGES.BONUS}star2.png`);

        // Load title
        this.assets.title = this.loadImage(`${CONFIG.PATHS.IMAGES.TITLE}Title.png`);

        // Load animation frames
        for (let i = 1; i <= 69; i++) {  // Changed to <= 69 to include frame 69
            const frameNumber = i.toString().padStart(2, '0');  // Removed the +1 since we want to start at 01
            const framePath = `${CONFIG.PATHS.IMAGES.ANIMATIONS}stick${frameNumber}.jpg`;
            this.assets.animations.push(this.loadImage(framePath));
        }
    }
}
