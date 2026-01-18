"use strict";
var KaijuRampageTheme = {
    name: 'kaiju_rampage',
    description: 'Destroyed city with fires, rubble, and giant monster silhouette',
    colors: {
        skyTop: { fg: DARKGRAY, bg: BG_BLACK },
        skyMid: { fg: BROWN, bg: BG_BLACK },
        skyHorizon: { fg: LIGHTRED, bg: BG_BLACK },
        skyGrid: { fg: DARKGRAY, bg: BG_BLACK },
        skyGridGlow: { fg: BROWN, bg: BG_BLACK },
        celestialCore: { fg: LIGHTRED, bg: BG_BLACK },
        celestialGlow: { fg: YELLOW, bg: BG_BLACK },
        starBright: { fg: DARKGRAY, bg: BG_BLACK },
        starDim: { fg: BLACK, bg: BG_BLACK },
        sceneryPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        scenerySecondary: { fg: BROWN, bg: BG_BLACK },
        sceneryTertiary: { fg: LIGHTRED, bg: BG_BLACK },
        roadSurface: { fg: LIGHTGRAY, bg: BG_BLACK },
        roadSurfaceAlt: { fg: DARKGRAY, bg: BG_BLACK },
        roadStripe: { fg: WHITE, bg: BG_BLACK },
        roadEdge: { fg: LIGHTRED, bg: BG_BLACK },
        roadGrid: { fg: BROWN, bg: BG_BLACK },
        shoulderPrimary: { fg: BROWN, bg: BG_BLACK },
        shoulderSecondary: { fg: DARKGRAY, bg: BG_BLACK },
        roadsideColors: {
            'rubble': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'fire': {
                primary: { fg: LIGHTRED, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'wrecked_car': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK },
                tertiary: { fg: LIGHTRED, bg: BG_BLACK }
            },
            'fallen_building': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK }
            },
            'tank': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'monster_footprint': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'danger_sign': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: LIGHTRED, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'gradient',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'destroyed_city',
        config: {
            parallaxSpeed: 0.15
        }
    },
    celestial: {
        type: 'monster',
        size: 5,
        positionX: 0.5,
        positionY: 0.5
    },
    stars: {
        enabled: false,
        density: 0,
        twinkle: false
    },
    ground: {
        type: 'solid',
        primary: { fg: BROWN, bg: BG_BLACK },
        secondary: { fg: DARKGRAY, bg: BG_BLACK },
        pattern: {
            gridSpacing: 20,
            radialLines: 0
        }
    },
    roadside: {
        pool: [
            { sprite: 'fleeing_person', weight: 4, side: 'both' },
            { sprite: 'wrecked_car', weight: 3, side: 'both' },
            { sprite: 'fire', weight: 2, side: 'both' },
            { sprite: 'rubble', weight: 2, side: 'both' },
            { sprite: 'danger_sign', weight: 1, side: 'both' }
        ],
        spacing: 12,
        density: 0.9
    }
};
registerTheme(KaijuRampageTheme);
function getKaijuSprite(type) {
    switch (type) {
        case 'rubble': return KaijuSprites.createRubble();
        case 'fire': return KaijuSprites.createFire();
        case 'wrecked_car': return KaijuSprites.createWreckedCar();
        case 'fallen_building': return KaijuSprites.createFallenBuilding();
        case 'tank': return KaijuSprites.createTank();
        case 'monster_footprint': return KaijuSprites.createFootprint();
        case 'danger_sign': return KaijuSprites.createDangerSign();
        default: return null;
    }
}
