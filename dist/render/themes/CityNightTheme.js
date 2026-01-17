"use strict";
var CityNightTheme = {
    name: 'city_night',
    description: 'Midnight city drive with skyscrapers, stars, and neon lights',
    colors: {
        skyTop: { fg: BLUE, bg: BG_BLACK },
        skyMid: { fg: BLUE, bg: BG_BLACK },
        skyHorizon: { fg: LIGHTBLUE, bg: BG_BLACK },
        skyGrid: { fg: BLUE, bg: BG_BLACK },
        skyGridGlow: { fg: LIGHTBLUE, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_BLACK },
        celestialGlow: { fg: YELLOW, bg: BG_BLACK },
        starBright: { fg: YELLOW, bg: BG_BLACK },
        starDim: { fg: BROWN, bg: BG_BLACK },
        sceneryPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        scenerySecondary: { fg: YELLOW, bg: BG_BLACK },
        sceneryTertiary: { fg: LIGHTRED, bg: BG_BLACK },
        roadSurface: { fg: DARKGRAY, bg: BG_LIGHTGRAY },
        roadSurfaceAlt: { fg: BLACK, bg: BG_LIGHTGRAY },
        roadStripe: { fg: YELLOW, bg: BG_LIGHTGRAY },
        roadEdge: { fg: LIGHTBLUE, bg: BG_BLUE },
        roadGrid: { fg: DARKGRAY, bg: BG_LIGHTGRAY },
        shoulderPrimary: { fg: LIGHTGRAY, bg: BG_BLUE },
        shoulderSecondary: { fg: DARKGRAY, bg: BG_BLACK },
        roadsideColors: {
            'building': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK },
                tertiary: { fg: LIGHTCYAN, bg: BG_BLACK }
            },
            'lamppost': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'sign': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK }
            },
            'tree': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: GREEN, bg: BG_BLACK },
                tertiary: { fg: DARKGRAY, bg: BG_BLACK }
            }
        }
    },
    background: {
        type: 'skyscrapers',
        config: {
            density: 0.8,
            hasWindows: true,
            hasAntennas: true,
            parallaxSpeed: 0.15
        }
    },
    celestial: {
        type: 'moon',
        size: 2,
        positionX: 0.8,
        positionY: 0.2
    },
    stars: {
        enabled: true,
        density: 0.3,
        twinkle: true
    },
    roadside: {
        spriteTypes: ['building', 'lamppost', 'sign'],
        spacing: 12,
        density: 1.2
    }
};
registerTheme(CityNightTheme);
