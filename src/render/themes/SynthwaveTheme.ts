/**
 * SynthwaveTheme - The classic OutRun synthwave aesthetic.
 * 
 * Features:
 * - Magenta/cyan sky grid
 * - Purple mountains
 * - Red/yellow sun
 * - Black road with cyan grid lines
 * - Trees, rocks, bushes on roadside
 */

var SynthwaveTheme: Theme = {
  name: 'synthwave',
  description: 'Classic 80s synthwave with magenta sky, purple mountains, and setting sun',
  
  colors: {
    // Sky - magenta grid on black
    skyTop: { fg: MAGENTA, bg: BG_BLACK },
    skyMid: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    skyHorizon: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    
    // Sky grid (synthwave signature look)
    skyGrid: { fg: MAGENTA, bg: BG_BLACK },
    skyGridGlow: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    
    // Sun - orange/red sunset
    celestialCore: { fg: YELLOW, bg: BG_RED },
    celestialGlow: { fg: LIGHTRED, bg: BG_BLACK },
    
    // Stars (not prominent in synthwave but available)
    starBright: { fg: WHITE, bg: BG_BLACK },
    starDim: { fg: LIGHTGRAY, bg: BG_BLACK },
    
    // Mountains - purple silhouettes
    sceneryPrimary: { fg: MAGENTA, bg: BG_BLACK },
    scenerySecondary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    sceneryTertiary: { fg: WHITE, bg: BG_BLACK },  // Snow caps
    
    // Road - black with cyan accents
    roadSurface: { fg: CYAN, bg: BG_BLACK },
    roadSurfaceAlt: { fg: LIGHTCYAN, bg: BG_BLACK },
    roadStripe: { fg: WHITE, bg: BG_BLACK },
    roadEdge: { fg: LIGHTRED, bg: BG_BLACK },
    roadGrid: { fg: CYAN, bg: BG_BLACK },
    
    // Shoulders - brown dirt
    shoulderPrimary: { fg: BROWN, bg: BG_BLACK },
    shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
    
    // Roadside object colors (using defaults - green trees, gray rocks, green bushes)
    roadsideColors: {
      'tree': {
        primary: { fg: LIGHTGREEN, bg: BG_BLACK },
        secondary: { fg: GREEN, bg: BG_BLACK },
        tertiary: { fg: BROWN, bg: BG_BLACK }  // trunk
      },
      'rock': {
        primary: { fg: DARKGRAY, bg: BG_BLACK },
        secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
      },
      'bush': {
        primary: { fg: GREEN, bg: BG_BLACK },
        secondary: { fg: LIGHTGREEN, bg: BG_BLACK }
      }
    }
  },
  
  background: {
    type: 'mountains',
    config: {
      count: 5,
      minHeight: 3,
      maxHeight: 6,
      parallaxSpeed: 0.1
    }
  },
  
  celestial: {
    type: 'sun',
    size: 3,
    positionX: 0.5,  // centered
    positionY: 0.6   // low in sky, near horizon
  },
  
  stars: {
    enabled: false,
    density: 0,
    twinkle: false
  },
  
  roadside: {
    spriteTypes: ['tree', 'rock', 'bush'],
    spacing: 10,
    density: 1.0
  }
};

// Register the theme
registerTheme(SynthwaveTheme);
