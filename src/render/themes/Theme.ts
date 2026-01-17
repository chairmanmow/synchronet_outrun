/**
 * Theme - Interface defining a complete visual aesthetic.
 * 
 * Themes are composable: you can mix and match elements.
 * Each theme defines colors, patterns, and sprites for all scene elements.
 * 
 * Color system: Themes define a color palette that can recolor shared
 * background renderers and sprites. This allows mountains rendered in
 * purple in one theme to be green in another.
 */

interface ColorPair {
  fg: number;
  bg: number;
}

interface ThemeColors {
  // Sky background
  skyTop: ColorPair;
  skyMid: ColorPair;
  skyHorizon: ColorPair;
  
  // Sky grid (synthwave aesthetic)
  skyGrid: ColorPair;
  skyGridGlow: ColorPair;
  
  // Celestial body (sun/moon)
  celestialCore: ColorPair;
  celestialGlow: ColorPair;
  
  // Stars (if enabled)
  starBright: ColorPair;
  starDim: ColorPair;
  
  // Background scenery (mountains/buildings/etc)
  sceneryPrimary: ColorPair;      // Main color (mountain body, building walls)
  scenerySecondary: ColorPair;    // Accent (highlights, windows)
  sceneryTertiary: ColorPair;     // Additional detail (snow caps, antennas)
  
  // Road surface
  roadSurface: ColorPair;         // Main road color
  roadSurfaceAlt: ColorPair;      // Alternating shade for depth
  roadStripe: ColorPair;          // Center line
  roadEdge: ColorPair;            // Road edge/curb
  roadGrid: ColorPair;            // Grid lines on road (if any)
  
  // Road shoulders/off-road
  shoulderPrimary: ColorPair;     // Immediate road edge (dirt, curb)
  shoulderSecondary: ColorPair;   // Further out
  
  // Roadside object color overrides (optional - uses sprite defaults if not set)
  roadsideColors?: {
    [spriteName: string]: {
      primary: ColorPair;
      secondary?: ColorPair;
      tertiary?: ColorPair;
    };
  };
}

interface ThemeBackgroundElement {
  type: 'mountains' | 'skyscrapers' | 'dunes' | 'forest' | 'hills';
  // Configuration varies by type
  config: {
    // Mountains/hills
    count?: number;
    minHeight?: number;
    maxHeight?: number;
    // Skyscrapers
    density?: number;
    hasWindows?: boolean;
    hasAntennas?: boolean;
    // General
    parallaxSpeed?: number;
  };
}

interface ThemeCelestialBody {
  type: 'sun' | 'moon' | 'none';
  size: number;           // 1-5 scale
  positionX: number;      // 0=left, 0.5=center, 1=right
  positionY: number;      // 0=top of sky, 1=at horizon
}

interface ThemeStars {
  enabled: boolean;
  density: number;        // 0-1, how many stars
  twinkle: boolean;       // Animated twinkle effect
}

interface ThemeRoadsideConfig {
  // Which sprite types appear in this theme
  spriteTypes: string[];  // e.g. ['tree', 'rock', 'bush'] or ['building', 'lamppost', 'sign']
  // Spacing between objects (world units)
  spacing: number;
  // Density multiplier (1 = normal, 2 = double, 0.5 = half)
  density: number;
}

interface Theme {
  name: string;
  description: string;
  
  // Complete color palette
  colors: ThemeColors;
  
  // Background scenery renderer
  background: ThemeBackgroundElement;
  
  // Celestial body (sun/moon)
  celestial: ThemeCelestialBody;
  
  // Star field
  stars: ThemeStars;
  
  // Roadside objects configuration
  roadside: ThemeRoadsideConfig;
}

/**
 * Global registry of available themes
 */
var ThemeRegistry: { [key: string]: Theme } = {};

/**
 * Global registry of roadside sprite creators
 */
var ROADSIDE_SPRITES: { [key: string]: () => SpriteDefinition } = {};

/**
 * Register a theme
 */
function registerTheme(theme: Theme): void {
  ThemeRegistry[theme.name] = theme;
}

/**
 * Register a roadside sprite
 */
function registerRoadsideSprite(name: string, creator: () => SpriteDefinition): void {
  ROADSIDE_SPRITES[name] = creator;
}

/**
 * Get a theme by name
 */
function getTheme(name: string): Theme | null {
  return ThemeRegistry[name] || null;
}

/**
 * Get all theme names
 */
function getThemeNames(): string[] {
  var names: string[] = [];
  for (var key in ThemeRegistry) {
    if (ThemeRegistry.hasOwnProperty(key)) {
      names.push(key);
    }
  }
  return names;
}
