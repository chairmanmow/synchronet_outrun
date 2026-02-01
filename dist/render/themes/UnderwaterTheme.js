"use strict";
var UnderwaterTheme = {
    name: 'underwater_grotto',
    description: 'Race through a magical underwater world filled with marine life',
    colors: {
        skyTop: { fg: CYAN, bg: BG_CYAN },
        skyMid: { fg: LIGHTCYAN, bg: BG_BLUE },
        skyHorizon: { fg: LIGHTBLUE, bg: BG_BLUE },
        skyGrid: { fg: LIGHTCYAN, bg: BG_BLUE },
        skyGridGlow: { fg: WHITE, bg: BG_CYAN },
        celestialCore: { fg: LIGHTMAGENTA, bg: BG_BLUE },
        celestialGlow: { fg: LIGHTCYAN, bg: BG_BLUE },
        starBright: { fg: WHITE, bg: BG_BLUE },
        starDim: { fg: LIGHTCYAN, bg: BG_BLUE },
        sceneryPrimary: { fg: LIGHTGRAY, bg: BG_BLACK },
        scenerySecondary: { fg: WHITE, bg: BG_BLUE },
        sceneryTertiary: { fg: LIGHTGREEN, bg: BG_BLUE },
        roadSurface: { fg: LIGHTBLUE, bg: BG_BLUE },
        roadSurfaceAlt: { fg: CYAN, bg: BG_CYAN },
        roadStripe: { fg: WHITE, bg: BG_BLUE },
        roadEdge: { fg: LIGHTCYAN, bg: BG_CYAN },
        roadGrid: { fg: BLUE, bg: BG_BLUE },
        shoulderPrimary: { fg: YELLOW, bg: BG_BLUE },
        shoulderSecondary: { fg: BROWN, bg: BG_CYAN },
        itemBox: {
            border: { fg: LIGHTCYAN, bg: BG_BLUE },
            fill: { fg: CYAN, bg: BG_BLUE },
            symbol: { fg: YELLOW, bg: BG_BLUE }
        },
        roadsideColors: {
            'underwater_fish': {
                primary: { fg: YELLOW, bg: BG_BLUE },
                secondary: { fg: LIGHTRED, bg: BG_BLUE }
            },
            'underwater_coral': {
                primary: { fg: LIGHTRED, bg: BG_BLUE },
                secondary: { fg: LIGHTMAGENTA, bg: BG_BLUE }
            },
            'underwater_seaweed': {
                primary: { fg: LIGHTGREEN, bg: BG_BLUE },
                secondary: { fg: GREEN, bg: BG_BLUE }
            },
            'underwater_anemone': {
                primary: { fg: LIGHTMAGENTA, bg: BG_BLUE },
                secondary: { fg: YELLOW, bg: BG_BLUE }
            },
            'underwater_jellyfish': {
                primary: { fg: LIGHTMAGENTA, bg: BG_BLUE },
                secondary: { fg: LIGHTCYAN, bg: BG_BLUE }
            },
            'underwater_treasure': {
                primary: { fg: YELLOW, bg: BG_BLUE },
                secondary: { fg: BROWN, bg: BG_BLUE }
            }
        }
    },
    sky: {
        type: 'water',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'aquarium',
        config: {
            kelp: true,
            bubbles: true,
            parallaxSpeed: 0.08
        }
    },
    celestial: {
        type: 'mermaid',
        size: 4,
        positionX: 0.5,
        positionY: 0.5
    },
    stars: {
        enabled: true,
        density: 0.3,
        twinkle: true
    },
    ground: {
        type: 'water',
        primary: { fg: LIGHTBLUE, bg: BG_BLUE },
        secondary: { fg: LIGHTCYAN, bg: BG_CYAN },
        pattern: {
            ditherDensity: 0.4,
            ditherChars: ['~', GLYPH.LIGHT_SHADE, '.', 'o']
        }
    },
    roadside: {
        pool: [
            { sprite: 'underwater_fish', weight: 4, side: 'both' },
            { sprite: 'underwater_coral', weight: 4, side: 'both' },
            { sprite: 'underwater_seaweed', weight: 3, side: 'both' },
            { sprite: 'underwater_anemone', weight: 4, side: 'both' },
            { sprite: 'underwater_jellyfish', weight: 3, side: 'both' },
            { sprite: 'underwater_treasure', weight: 1, side: 'both' }
        ],
        spacing: 35,
        density: 1.3
    }
};
registerTheme(UnderwaterTheme);
