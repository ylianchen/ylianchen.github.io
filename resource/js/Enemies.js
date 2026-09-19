// js/classes/Enemies.js

class Roadblock {
    constructor(y, x, vy, assets) {
        this.y = y;
        this.x = x;
        this.baseVy = vy || (CONFIG.GAME.ENEMIES.ROADBLOCK_BASE_SPEED || 4.8);
        this.blockImage = assets.cars.block;
        this.width = 130;
        this.height = 30;
        this.onScreen = true;
    }

    update() {
        const speedMultiplier = (typeof newGlobalSpeed !== 'undefined' && typeof globalSpeed !== 'undefined' && globalSpeed > 0)
            ? (newGlobalSpeed / globalSpeed) : 1;
        // Strictly fixed vertical movement - no horizontal tracking
        this.y += this.baseVy * speedMultiplier;

        if (this.y > height + 50) {
            this.onScreen = false;
        }
    }

    display() {
        if (this.blockImage) {
            image(this.blockImage, this.x, this.y, this.width, this.height);
        }
    }

    isColliding(player) {
        const pW = 27;
        const pH = 57;
        return (
            player.x < this.x + this.width &&
            player.x + pW > this.x &&
            player.y < this.y + this.height &&
            player.y + pH > this.y
        );
    }
}

class Chaser {
    constructor(y, x, vx, vy, assets) {
        this.y = y;
        this.x = x;
        this.vx = vx || 0;
        this.baseVy = vy || (CONFIG.GAME.ENEMIES.BASE_SPEED || 2.2);
        this.copImage = assets.cars.cop;
        this.width = 32;
        this.height = 69;
        this.onScreen = true;
    }

    update(playerX, roadblocks = []) {
        const speedMultiplier = (typeof newGlobalSpeed !== 'undefined' && typeof globalSpeed !== 'undefined' && globalSpeed > 0)
            ? (newGlobalSpeed / globalSpeed) : 1;
        this.y += this.baseVy * speedMultiplier;

        const roadLeft = 175;
        const roadRight = 505;
        const margin = 18;

        // Check for any threatening roadblock nearby or approaching
        let threateningBlock = null;
        let minThreatDist = Infinity;

        for (const rb of roadblocks) {
            if (!rb.onScreen) continue;

            // Hazard window: roadblock overtaking from behind or nearby vertically
            const vertDist = rb.y - this.y;
            const isHazard = (vertDist >= -160 && vertDist <= 100);

            if (isHazard) {
                const dangerLeft = rb.x - this.width - margin;
                const dangerRight = rb.x + rb.width + margin;

                if (this.x >= dangerLeft && this.x <= dangerRight) {
                    const absDist = Math.abs(vertDist);
                    if (absDist < minThreatDist) {
                        minThreatDist = absDist;
                        threateningBlock = rb;
                    }
                }
            }
        }

        if (threateningBlock) {
            // Determine best safe evasion target: left or right of roadblock
            const safeLeftX = threateningBlock.x - this.width - margin;
            const safeRightX = threateningBlock.x + threateningBlock.width + margin;

            const canGoLeft = safeLeftX >= roadLeft;
            const canGoRight = safeRightX + this.width <= roadRight;

            let targetX;
            if (canGoLeft && !canGoRight) {
                targetX = safeLeftX;
            } else if (!canGoLeft && canGoRight) {
                targetX = safeRightX;
            } else if (canGoLeft && canGoRight) {
                // Bias toward player's side to maintain chase while avoiding obstacle
                if (playerX < threateningBlock.x + threateningBlock.width / 2) {
                    targetX = safeLeftX;
                } else {
                    targetX = safeRightX;
                }
            } else {
                const blockCenter = threateningBlock.x + threateningBlock.width / 2;
                targetX = this.x < blockCenter ? safeLeftX : safeRightX;
            }

            // Actively steer around the roadblock
            const evasionSpeed = 3.6 * speedMultiplier;
            if (this.x < targetX) {
                this.x = Math.min(targetX, this.x + evasionSpeed);
            } else if (this.x > targetX) {
                this.x = Math.max(targetX, this.x - evasionSpeed);
            }
        } else {
            // Normal player tracking
            const dx = playerX - this.x;
            this.x += dx * (CONFIG.GAME.ENEMIES.EASING || 0.002) * speedMultiplier;
        }

        // Strict physical non-overlapping barrier constraint
        // Ensures the cop car NEVER intersects the roadblock bounding box under any circumstance
        for (const rb of roadblocks) {
            if (!rb.onScreen) continue;
            const yOverlaps = (this.y < rb.y + rb.height + 2) && (this.y + this.height > rb.y - 2);
            if (yOverlaps) {
                const xOverlaps = (this.x < rb.x + rb.width + 2) && (this.x + this.width > rb.x - 2);
                if (xOverlaps) {
                    const distToLeft = (this.x + this.width) - rb.x;
                    const distToRight = (rb.x + rb.width) - this.x;
                    const safeLeftX = rb.x - this.width - 4;
                    const safeRightX = rb.x + rb.width + 4;

                    if (distToLeft < distToRight && safeLeftX >= roadLeft) {
                        this.x = safeLeftX;
                    } else if (safeRightX + this.width <= roadRight) {
                        this.x = safeRightX;
                    } else if (safeLeftX >= roadLeft) {
                        this.x = safeLeftX;
                    }
                }
            }
        }

        // Keep cop car within drivable highway boundaries
        this.x = Math.max(roadLeft, Math.min(roadRight - this.width, this.x));
        
        if (this.y > height + 100) {
            this.onScreen = false;
        }
    }

    display() {
        if (this.copImage) {
            image(this.copImage, this.x, this.y);
        }
    }

    isColliding(player) {
        const pW = 27;
        const pH = 57;
        return (
            player.x < this.x + this.width &&
            player.x + pW > this.x &&
            player.y < this.y + this.height &&
            player.y + pH > this.y
        );
    }
}