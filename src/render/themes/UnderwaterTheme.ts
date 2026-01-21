/**
 * UnderwaterTheme.ts - Deep sea racing through an underwater grotto.
 * Animated water effects, colorful marine life, and aquarium atmosphere.
 */

var UnderwaterTheme: Theme = {
  name: 'underwater_grotto',
  description: 'Race through a magical underwater world filled with marine life',
  
  colors: {
    // Deep ocean sky - dark blues fading to lighter
    skyTop: { fg: BLUE, bg: BG_BLUE },
    skyMid: { fg: LIGHTBLUE, bg: BG_BLUE },
    skyHorizon: { fg: LIGHTCYAN, bg: BG_CYAN },
    
    // Water caustics/ripple grid
    skyGrid: { fg: LIGHTCYAN, bg: BG_BLUE },
    skyGridGlow: { fg: WHITE, bg: BG_BLUE },
    
    // Mermaid silhouette glow
    celestialCore: { fg: LIGHTMAGENTA, bg: BG_BLUE },
    celestialGlow: { fg: LIGHTCYAN, bg: BG_BLUE },
    
    // Bioluminescent particles
    starBright: { fg: LIGHTCYAN, bg: BG_BLUE },
    starDim: { fg: CYAN, bg: BG_BLUE },
    
    // Underwater rock formations
    sceneryPrimary: { fg: DARKGRAY, bg: BG_BLUE },
    scenerySecondary: { fg: LIGHTGRAY, bg: BG_BLUE },
    sceneryTertiary: { fg: GREEN, bg: BG_BLUE },  // Kelp/seaweed accents
    
    // Blue coral road
    roadSurface: { fg: LIGHTBLUE, bg: BG_BLUE },
    roadSurfaceAlt: { fg: CYAN, bg: BG_CYAN },
    roadStripe: { fg: WHITE, bg: BG_BLUE },
    roadEdge: { fg: LIGHTCYAN, bg: BG_CYAN },
    roadGrid: { fg: BLUE, bg: BG_BLUE },
    
    // Sandy/rocky shoulders
    shoulderPrimary: { fg: YELLOW, bg: BG_BLUE },
    shoulderSecondary: { fg: BROWN, bg: BG_CYAN },
    
    // Roadside colors - underwater palette
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
      'underwater_rock': {
        primary: { fg: LIGHTGRAY, bg: BG_BLUE },
        secondary: { fg: DARKGRAY, bg: BG_BLUE }
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
  
  // Rippling water caustics in the "sky" (water above)
  sky: {
    type: 'grid',  // Use grid animation for caustics
    converging: false,
    horizontal: true  // Horizontal caustic lines
  },
  
  // Underwater rock formations and kelp forest background
  background: {
    type: 'underwater',
    config: {
      kelp: true,
      bubbles: true,
      parallaxSpeed: 0.08
    }
  },
  
  // Mermaid silhouette as celestial object
  celestial: {
    type: 'mermaid',
    size: 4,
    positionX: 0.7,
    positionY: 0.3
  },
  
  // Bioluminescent particles / bubbles
  stars: {
    enabled: true,
    density: 0.5,
    twinkle: true
  },
  
  // Animated water/sand floor
  ground: {
    type: 'water',  // New animated water type
    primary: { fg: LIGHTBLUE, bg: BG_BLUE },
    secondary: { fg: LIGHTCYAN, bg: BG_CYAN },
    pattern: {
      ditherDensity: 0.4,
      ditherChars: ['~', GLYPH.LIGHT_SHADE, '.', 'o']
    }
  },
  
  // Marine life roadside
  roadside: {
    pool: [
      { sprite: 'underwater_fish', weight: 5, side: 'both' },
      { sprite: 'underwater_coral', weight: 4, side: 'both' },
      { sprite: 'underwater_seaweed', weight: 4, side: 'both' },
      { sprite: 'underwater_rock', weight: 3, side: 'both' },
      { sprite: 'underwater_jellyfish', weight: 3, side: 'both' },
      { sprite: 'underwater_treasure', weight: 1, side: 'both' }
    ],
    spacing: 35,
    density: 1.3
  }
};

registerTheme(UnderwaterTheme);
