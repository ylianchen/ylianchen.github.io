// js/config.js
const CONFIG = {
    CANVAS: {
        WIDTH: 680,
        HEIGHT: 680,
        FRAME_RATE: 60
    },
    PATHS: {
        IMAGES: {
            CAR: './assets/images/car/',
            BONUS: './assets/images/bonus/',
            ANIMATIONS: './assets/images/animations/',
            TITLE: './assets/images/title/'
        }
    },
    GAME: {
        GLOBAL_SPEED: 0.5,
        BONUS: {
            BASE_SPEED: 3.8,
            SPAWN_CYCLE: 3500,
            EFFECT_DURATION: 7000
        },
        ENEMIES: {
            BASE_SPEED: 2.2,
            CHASER_SPAWN_CYCLE: 2500,
            ROADBLOCK_BASE_SPEED: 4.8,
            ROADBLOCK_INITIAL_DELAY: 12000,
            ROADBLOCK_INITIAL_CYCLE: 7500,
            ROADBLOCK_MIN_CYCLE: 2800,
            EASING: 0.002
        },
        SCORE: {
            INCREMENT: 0.005
        }
    }
};
