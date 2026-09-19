// Updated main.js
let assetLoader;
let player;
let animations = [];
let bonus;
let chasers = [];
let roadblocks = [];
let gameState = {
    screen: 0,
    score: 0,
    collision: false,
    startTime: 0,
    lastChaserSpawn: 0,
    lastRoadblockSpawn: 0,
    lastBonusSpawn: 0
};

let globalSpeed = CONFIG.GAME.GLOBAL_SPEED;
let newGlobalSpeed = globalSpeed;
let bonusScore = 0;
let invisible = false;
let scoreIncrement = CONFIG.GAME.SCORE.INCREMENT;

// Independent Power-Up Effects
let powerUpEffects = {
    doubleScore: { active: false, name: "2X SCORE", endTime: 0 },
    slowMo:      { active: false, name: "SLOW MOTION", endTime: 0 },
    invincible:  { active: false, name: "INVINCIBLE", endTime: 0 }
};
let lastBonusType = null;

function preload() {
    assetLoader = new AssetLoader();
    assetLoader.loadGameAssets();
}

function setup() {
    let canvas = createCanvas(CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    canvas.parent('game-container');
    frameRate(CONFIG.CANVAS.FRAME_RATE);
    
    player = new Player(assetLoader);
    initializeAnimations();
    resetGame();
}

function initializeAnimations() {
    animations = [
        new Animation(assetLoader.assets.animations, 0, 0)
    ];
}

// Selects next random bonus type ensuring rotation across plays
function getNextBonusType(prevType) {
    const types = [0, 1, 2];
    if (prevType !== null && prevType !== undefined) {
        const pool = types.filter(t => t !== prevType);
        return pool[Math.floor(Math.random() * pool.length)];
    }
    return Math.floor(Math.random() * 3);
}

function applyBonusEffect(type) {
    const duration = (CONFIG.GAME.BONUS && CONFIG.GAME.BONUS.EFFECT_DURATION) || 7000;
    const now = millis();

    switch(type) {
        case 0: // Star: 2X Points
            powerUpEffects.doubleScore.active = true;
            powerUpEffects.doubleScore.endTime = now + duration;
            bonusScore = scoreIncrement * 2;
            break;
        case 1: // Clock: Slow down time
            powerUpEffects.slowMo.active = true;
            powerUpEffects.slowMo.endTime = now + duration;
            newGlobalSpeed = globalSpeed * 0.5;
            break;
        case 2: // Kanji: Invincible
            powerUpEffects.invincible.active = true;
            powerUpEffects.invincible.endTime = now + duration;
            invisible = true;
            if (player) player.opacity = 140;
            break;
    }
}

function updateActiveBonusEffect() {
    const now = millis();

    // 1. Double score check
    if (powerUpEffects.doubleScore.active) {
        if (now >= powerUpEffects.doubleScore.endTime) {
            powerUpEffects.doubleScore.active = false;
            bonusScore = 0;
        }
    }

    // 2. Slow motion check
    if (powerUpEffects.slowMo.active) {
        if (now >= powerUpEffects.slowMo.endTime) {
            powerUpEffects.slowMo.active = false;
            newGlobalSpeed = globalSpeed;
        }
    }

    // 3. Invincible check (Strictly independent of other power-ups!)
    if (powerUpEffects.invincible.active) {
        if (now >= powerUpEffects.invincible.endTime) {
            powerUpEffects.invincible.active = false;
            invisible = false;
            if (player) player.opacity = 255;
        } else {
            invisible = true;
            if (player) player.opacity = 140;
        }
    } else {
        invisible = false;
        if (player && player.opacity !== 255) {
            player.opacity = 255;
        }
    }
}

function removeBonusEffect() {
    powerUpEffects.doubleScore.active = false;
    powerUpEffects.slowMo.active = false;
    powerUpEffects.invincible.active = false;
    newGlobalSpeed = globalSpeed;
    bonusScore = 0;
    invisible = false;
    if (player) player.opacity = 255;
}

function resetGame() {
    cleanup();
    removeBonusEffect();
    
    gameState.score = 0;
    gameState.collision = false;
    gameState.startTime = millis();
    gameState.lastChaserSpawn = millis();
    gameState.lastRoadblockSpawn = millis();
    gameState.lastBonusSpawn = millis();
    
    globalSpeed = CONFIG.GAME.GLOBAL_SPEED;
    newGlobalSpeed = globalSpeed;
    scoreIncrement = CONFIG.GAME.SCORE.INCREMENT;
    bonusScore = 0;
    invisible = false;
    
    player.reset();
    
    // Spawn initial bonus with random type
    lastBonusType = Math.floor(Math.random() * 3);
    const bonusX = random(180, width - 210);
    bonus = new Bonus(bonusX, lastBonusType, CONFIG.GAME.BONUS.BASE_SPEED || 3.8, assetLoader.assets);
    
    // Spawn initial chaser
    const chaserX = random(180, width - 212);
    chasers.push(new Chaser(-70, chaserX, 0, CONFIG.GAME.ENEMIES.BASE_SPEED || 2.2, assetLoader.assets));
}

function cleanup() {
    bonus = null;
    chasers = [];
    roadblocks = [];
}

function draw() {
    background(0);
    updateAnimations();
    
    switch(gameState.screen) {
        case 0:
            drawStartScreen();
            break;
        case 1:
            drawGameplay();
            break;
        case 2:
            drawGameOver();
            break;
    }
}

function updateAnimations() {
    for (let anim of animations) {
        anim.display();
        anim.next();
    }
}

function drawStartScreen() {
    if (assetLoader.assets.title) {
        image(assetLoader.assets.title, 0, 0);
    }
    
    // Draw car selector arrow triangles
    noStroke();
    fill(0, 180, 180);
    triangle(240, 400, 215, 420, 240, 440);
    triangle(440, 400, 465, 420, 440, 440);
    
    // Draw selected car
    let selectedCarImg = player.selectedCar === 0 ? 
        assetLoader.assets.cars.player1 : 
        assetLoader.assets.cars.player2;
    if (selectedCarImg) {
        image(selectedCarImg, width / 2 - 13, 395);
    }

    // Change mouse cursor over clickable elements
    if (
        (mouseX < 420 && mouseX > 260 && mouseY < 260 && mouseY > 180) ||
        (mouseX < 250 && mouseX > 210 && mouseY < 445 && mouseY > 395) ||
        (mouseX < 470 && mouseX > 430 && mouseY < 445 && mouseY > 395)
    ) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }
}

function drawGameplay() {
    cursor(ARROW);
    player.move();
    player.display();
    
    // Update active power-up duration
    updateActiveBonusEffect();
    
    // Update & display bonus
    if (bonus && bonus.onScreen && !bonus.isCollected) {
        bonus.update();
        bonus.display();
        bonus.checkCollection(player);
    } else {
        // Spawn next bonus with guaranteed random rotation
        if (millis() - gameState.lastBonusSpawn > (CONFIG.GAME.BONUS.SPAWN_CYCLE || 3500)) {
            const nextType = getNextBonusType(lastBonusType);
            lastBonusType = nextType;
            const spawnX = random(180, width - 210);
            bonus = new Bonus(spawnX, nextType, CONFIG.GAME.BONUS.BASE_SPEED || 3.8, assetLoader.assets);
            gameState.lastBonusSpawn = millis();
        }
    }
    
    updateEnemies();
    
    gameState.score += scoreIncrement + bonusScore;
    
    // Score display
    textSize(24);
    textAlign(LEFT, TOP);
    fill(255);
    text(`Score: ${Math.floor(gameState.score)}`, 20, 20);
    
    // Active power-up HUD badges (independently displays all currently active effects)
    const activeList = [];
    const now = millis();
    if (powerUpEffects.invincible.active) {
        const timeLeft = Math.max(0, Math.ceil((powerUpEffects.invincible.endTime - now) / 1000));
        activeList.push({ name: "INVINCIBLE", time: timeLeft, color: [255, 90, 90] });
    }
    if (powerUpEffects.slowMo.active) {
        const timeLeft = Math.max(0, Math.ceil((powerUpEffects.slowMo.endTime - now) / 1000));
        activeList.push({ name: "SLOW MOTION", time: timeLeft, color: [100, 220, 255] });
    }
    if (powerUpEffects.doubleScore.active) {
        const timeLeft = Math.max(0, Math.ceil((powerUpEffects.doubleScore.endTime - now) / 1000));
        activeList.push({ name: "2X SCORE", time: timeLeft, color: [255, 215, 0] });
    }

    if (activeList.length > 0) {
        push();
        const badgeW = 140;
        const totalW = activeList.length * badgeW + (activeList.length - 1) * 8;
        let startX = (width - totalW) / 2 + badgeW / 2;
        
        for (const item of activeList) {
            rectMode(CENTER);
            noStroke();
            fill(0, 180);
            rect(startX, 28, badgeW, 26, 13);
            fill(item.color[0], item.color[1], item.color[2]);
            textSize(11);
            textAlign(CENTER, CENTER);
            text(`${item.name} (${item.time}s)`, startX, 28);
            startX += badgeW + 8;
        }
        pop();
    }
    
    if (!invisible && checkEnemyCollision()) {
        gameState.collision = true;
        gameState.screen = 2;
    }
}

function updateEnemies() {
    const elapsedSec = Math.max(0, (millis() - gameState.startTime) / 1000);
    
    // Progressive speed scaling over time
    // Base cop speed is 2.2; scales up smoothly with time played
    const currentCopSpeed = Math.min(9.5, (CONFIG.GAME.ENEMIES.BASE_SPEED || 2.2) + elapsedSec * 0.04);
    // Base roadblock speed is 4.8; noticeably faster than cop cars (stationary obstacle on moving highway)
    const currentRoadblockSpeed = Math.min(12.5, (CONFIG.GAME.ENEMIES.ROADBLOCK_BASE_SPEED || 4.8) + elapsedSec * 0.035);

    // Multi-cop car scaling:
    // 0s - 25s: max 1 cop car
    // 25s - 55s: max 2 cop cars
    // 55s+: max 3 cop cars
    let maxCopCars = 1;
    if (elapsedSec > 55) {
        maxCopCars = 3;
    } else if (elapsedSec > 25) {
        maxCopCars = 2;
    }

    // Cop car spawn interval decreases as game progresses
    const chaserInterval = Math.max(1500, (CONFIG.GAME.ENEMIES.CHASER_SPAWN_CYCLE || 2500) - elapsedSec * 15);

    if (chasers.length < maxCopCars && (millis() - gameState.lastChaserSpawn > chaserInterval)) {
        // Collect lanes occupied by roadblocks near top (y < 160) and cops near top (y < 140)
        const topBlocks = roadblocks.filter(r => r.y < 160);
        const topCops = chasers.filter(c => c.y < 140);

        let candidatePositions = [];
        for (let x = 180; x <= width - 212; x += 15) {
            const overlapsBlock = topBlocks.some(r => x < r.x + r.width + 20 && x + 32 > r.x - 20);
            const overlapsCop = topCops.some(c => Math.abs(x - c.x) < 45);
            if (!overlapsBlock && !overlapsCop) {
                candidatePositions.push(x);
            }
        }

        if (candidatePositions.length > 0) {
            const spawnX = candidatePositions[Math.floor(Math.random() * candidatePositions.length)];
            chasers.push(new Chaser(-70, spawnX, 0, currentCopSpeed, assetLoader.assets));
            gameState.lastChaserSpawn = millis();
        }
    }

    // Update & display chasers (pass active roadblocks for intelligent evasion)
    for (let i = chasers.length - 1; i >= 0; i--) {
        const c = chasers[i];
        c.baseVy = currentCopSpeed;
        c.update(player.x, roadblocks);
        c.display();
        if (!c.onScreen) {
            chasers.splice(i, 1);
        }
    }

    // Mutual separation between multiple cop cars so they don't merge/overlap each other
    for (let i = 0; i < chasers.length; i++) {
        for (let j = i + 1; j < chasers.length; j++) {
            const c1 = chasers[i];
            const c2 = chasers[j];
            if (Math.abs(c1.y - c2.y) < 70 && Math.abs(c1.x - c2.x) < 34) {
                const push = 1.5;
                if (c1.x < c2.x) {
                    c1.x = Math.max(175, c1.x - push);
                    c2.x = Math.min(473, c2.x + push);
                } else {
                    c1.x = Math.min(473, c1.x + push);
                    c2.x = Math.max(175, c2.x - push);
                }
            }
        }
    }

    // Roadblock spawning with balanced progressive difficulty curve
    // Grace period: No roadblocks for the first 12 seconds
    if (elapsedSec > 12) {
        // Dynamic interval scaling:
        // 12s - 35s: ~7500ms down to ~5500ms (rare, gentle introduction)
        // 35s - 75s: ~5500ms down to ~3800ms (moderate)
        // 75s+: scales down to min 2800ms (challenging)
        let roadblockInterval;
        if (elapsedSec < 35) {
            roadblockInterval = 7500 - (elapsedSec - 12) * 85;
        } else if (elapsedSec < 75) {
            roadblockInterval = 5500 - (elapsedSec - 35) * 42;
        } else {
            roadblockInterval = Math.max(2800, 3800 - (elapsedSec - 75) * 15);
        }

        // Max simultaneous roadblocks on screen:
        // First 50 seconds: strict maximum of 1 roadblock on screen!
        // 50s+: maximum of 2 roadblocks on screen
        const maxRoadblocks = elapsedSec > 50 ? 2 : 1;

        // Ensure vertical spacing: do not spawn if any roadblock is in the upper half (y < 280)
        const upperBlock = roadblocks.find(r => r.y < 280);

        if (roadblocks.length < maxRoadblocks && !upperBlock && (millis() - gameState.lastRoadblockSpawn > roadblockInterval)) {
            // Find a safe spawn X that does not overlap any cop car near the entry zone (y < 150)
            const topCops = chasers.filter(c => c.y < 150);
            let validPositions = [];
            for (let candidateX = 175; candidateX <= 375; candidateX += 15) {
                const overlapsCop = topCops.some(c => candidateX < c.x + 32 + 25 && candidateX + 130 > c.x - 25);
                if (!overlapsCop) {
                    validPositions.push(candidateX);
                }
            }

            if (validPositions.length > 0) {
                const chosenX = validPositions[Math.floor(Math.random() * validPositions.length)];
                roadblocks.push(new Roadblock(-35, chosenX, currentRoadblockSpeed, assetLoader.assets));
                gameState.lastRoadblockSpawn = millis();
            }
        }
    }

    // Update & display roadblocks
    for (let i = roadblocks.length - 1; i >= 0; i--) {
        const r = roadblocks[i];
        r.baseVy = currentRoadblockSpeed;
        r.update();
        r.display();
        if (!r.onScreen) {
            roadblocks.splice(i, 1);
        }
    }
}

function drawGameOver() {
    cursor(HAND);
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    textSize(46);
    textAlign(CENTER, CENTER);
    fill(255, 60, 60);
    text("GAME OVER", width / 2, height / 2 - 60);
    
    textSize(26);
    fill(255);
    text(`Final Score: ${Math.floor(gameState.score)}`, width / 2, height / 2);
    
    textSize(18);
    fill(200);
    text("Press SPACE or Click to Play Again", width / 2, height / 2 + 60);
}

function checkEnemyCollision() {
    const copHit = chasers.some(c => c.onScreen && c.isColliding(player));
    const blockHit = roadblocks.some(r => r.onScreen && r.isColliding(player));
    return copHit || blockHit;
}

function keyPressed() {
    switch(gameState.screen) {
        case 0:
            if (keyCode === 32 || keyCode === 13) {
                gameState.screen = 1;
                resetGame();
            } else if (keyCode === LEFT_ARROW || keyCode === 65) {
                player.selectedCar = (player.selectedCar - 1 + 2) % 2;
            } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
                player.selectedCar = (player.selectedCar + 1) % 2;
            }
            break;
            
        case 1:
            break;
            
        case 2:
            if (keyCode === 32 || keyCode === 13) {
                gameState.screen = 0;
                resetGame();
            }
            break;
    }
}

function keyReleased() {
    // Continuous controls handled in Player.move()
}

function mousePressed() {
    if (gameState.screen === 0) {
        // Left arrow
        if (mouseX < 250 && mouseX > 210 && mouseY < 445 && mouseY > 395) {
            player.selectedCar = (player.selectedCar - 1 + 2) % 2;
        }
        // Right arrow
        if (mouseX < 470 && mouseX > 430 && mouseY < 445 && mouseY > 395) {
            player.selectedCar = (player.selectedCar + 1) % 2;
        }
        // Start button in Title graphic
        if (mouseX < 420 && mouseX > 260 && mouseY < 260 && mouseY > 180) {
            gameState.screen = 1;
            resetGame();
        }
    } else if (gameState.screen === 2) {
        gameState.screen = 0;
        resetGame();
    }
}