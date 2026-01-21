"use strict";
var CandyLandTheme = {
    name: 'candy_land',
    description: 'Race through a magical world made entirely of sweets and candy',
    colors: {
        skyTop: { fg: LIGHTCYAN, bg: BG_MAGENTA },
        skyMid: { fg: WHITE, bg: BG_MAGENTA },
        skyHorizon: { fg: LIGHTMAGENTA, bg: BG_CYAN },
        skyGrid: { fg: WHITE, bg: BG_MAGENTA },
        skyGridGlow: { fg: LIGHTCYAN, bg: BG_MAGENTA },
        celestialCore: { fg: YELLOW, bg: BG_MAGENTA },
        celestialGlow: { fg: WHITE, bg: BG_MAGENTA },
        starBright: { fg: WHITE, bg: BG_MAGENTA },
        starDim: { fg: LIGHTCYAN, bg: BG_MAGENTA },
        sceneryPrimary: { fg: WHITE, bg: BG_MAGENTA },
        scenerySecondary: { fg: LIGHTCYAN, bg: BG_MAGENTA },
        sceneryTertiary: { fg: LIGHTMAGENTA, bg: BG_CYAN },
        roadSurface: { fg: WHITE, bg: BG_MAGENTA },
        roadSurfaceAlt: { fg: LIGHTMAGENTA, bg: BG_MAGENTA },
        roadStripe: { fg: LIGHTCYAN, bg: BG_MAGENTA },
        roadEdge: { fg: WHITE, bg: BG_CYAN },
        roadGrid: { fg: LIGHTMAGENTA, bg: BG_MAGENTA },
        shoulderPrimary: { fg: WHITE, bg: BG_MAGENTA },
        shoulderSecondary: { fg: LIGHTMAGENTA, bg: BG_CYAN },
        roadsideColors: {
            'lollipop': {
                primary: { fg: LIGHTRED, bg: BG_CYAN },
                secondary: { fg: WHITE, bg: BG_CYAN }
            },
            'candy_cane': {
                primary: { fg: LIGHTRED, bg: BG_CYAN },
                secondary: { fg: WHITE, bg: BG_CYAN }
            },
            'gummy_bear': {
                primary: { fg: LIGHTGREEN, bg: BG_CYAN },
                secondary: { fg: GREEN, bg: BG_CYAN }
            },
            'cupcake': {
                primary: { fg: LIGHTMAGENTA, bg: BG_CYAN },
                secondary: { fg: LIGHTRED, bg: BG_CYAN }
            },
            'ice_cream': {
                primary: { fg: WHITE, bg: BG_CYAN },
                secondary: { fg: BROWN, bg: BG_CYAN }
            },
            'cotton_candy': {
                primary: { fg: LIGHTMAGENTA, bg: BG_CYAN },
                secondary: { fg: WHITE, bg: BG_CYAN }
            }
        }
    },
    sky: {
        type: 'stars',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'candy_hills',
        config: {
            swirls: true,
            parallaxSpeed: 0.12
        }
    },
    celestial: {
        type: 'sun',
        size: 3,
        positionX: 0.5,
        positionY: 0.3
    },
    stars: {
        enabled: true,
        density: 0.4,
        twinkle: true
    },
    ground: {
        type: 'candy',
        primary: { fg: WHITE, bg: BG_CYAN },
        secondary: { fg: LIGHTMAGENTA, bg: BG_CYAN },
        pattern: {
            ditherDensity: 0.4,
            ditherChars: ['*', '@', '.', '~']
        }
    },
    roadside: {
        pool: [
            { sprite: 'lollipop', weight: 4, side: 'both' },
            { sprite: 'candy_cane', weight: 4, side: 'both' },
            { sprite: 'gummy_bear', weight: 2, side: 'both' },
            { sprite: 'cupcake', weight: 3, side: 'both' },
            { sprite: 'ice_cream', weight: 2, side: 'both' },
            { sprite: 'cotton_candy', weight: 3, side: 'both' }
        ],
        spacing: 40,
        density: 1.2
    }
};
registerTheme(CandyLandTheme);
