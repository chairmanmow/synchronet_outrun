/**
 * ANSITunnelTheme - A surreal theme that renders ANSI art files as the road surface
 * and sky reflection, creating a "cyberspace tunnel" effect.
 * 
 * The theme loads ANSI art files from a directory and:
 * - Renders ANSI content as the road surface with perspective distortion
 * - Mirrors/reflects the ANSI in the sky area for a tunnel effect
 * - Scrolls through the ANSI based on track position
 * - Loops seamlessly when reaching the end
 */

// Configuration for ANSI loading
var ANSITunnelConfig = {
  directory: '/sbbs/text/futureland',
  scrollSpeed: 1.0,
  mirrorSky: true,
  colorShift: true
};

var ANSITunnelTheme: Theme = {
  name: 'ansi_tunnel',
  description: 'Race through scrolling ANSI art - a digital cyberspace tunnel',
  
  colors: {
    // Dark cyber sky
    skyTop: { fg: BLACK, bg: BG_BLACK },
    skyMid: { fg: DARKGRAY, bg: BG_BLACK },
    skyHorizon: { fg: CYAN, bg: BG_BLACK },
    
    // Cyan grid lines
    skyGrid: { fg: CYAN, bg: BG_BLACK },
    skyGridGlow: { fg: LIGHTCYAN, bg: BG_BLACK },
    
    // No celestial (replaced by ANSI)
    celestialCore: { fg: WHITE, bg: BG_BLACK },
    celestialGlow: { fg: CYAN, bg: BG_BLACK },
    
    // Digital "stars" (pixels)
    starBright: { fg: LIGHTCYAN, bg: BG_BLACK },
    starDim: { fg: CYAN, bg: BG_BLACK },
    
    // Cyber scenery
    sceneryPrimary: { fg: CYAN, bg: BG_BLACK },
    scenerySecondary: { fg: LIGHTCYAN, bg: BG_BLACK },
    sceneryTertiary: { fg: WHITE, bg: BG_BLACK },
    
    // Dark road with cyan accents
    roadSurface: { fg: DARKGRAY, bg: BG_BLACK },
    roadSurfaceAlt: { fg: BLACK, bg: BG_BLACK },
    roadStripe: { fg: LIGHTCYAN, bg: BG_BLACK },
    roadEdge: { fg: CYAN, bg: BG_BLACK },
    roadGrid: { fg: DARKGRAY, bg: BG_BLACK },
    
    // Cyber shoulders
    shoulderPrimary: { fg: DARKGRAY, bg: BG_BLACK },
    shoulderSecondary: { fg: BLACK, bg: BG_BLACK },
    
    // Roadside object colors
    roadsideColors: {
      'data_beacon': {
        primary: { fg: LIGHTCYAN, bg: BG_BLACK },
        secondary: { fg: CYAN, bg: BG_BLACK }
      },
      'data_node': {
        primary: { fg: CYAN, bg: BG_BLACK },
        secondary: { fg: DARKGRAY, bg: BG_BLACK }
      },
      'signal_pole': {
        primary: { fg: LIGHTCYAN, bg: BG_BLACK },
        secondary: { fg: DARKGRAY, bg: BG_BLACK }
      },
      'binary_pillar': {
        primary: { fg: LIGHTCYAN, bg: BG_BLACK },
        secondary: { fg: CYAN, bg: BG_BLACK }
      }
    },
    
    // Item boxes - digital theme
    itemBox: {
      border: { fg: LIGHTCYAN, bg: BG_BLACK },
      fill: { fg: DARKGRAY, bg: BG_BLACK },
      symbol: { fg: WHITE, bg: BG_BLACK }
    }
  },
  
  // Sky handled by ANSI renderer
  sky: {
    type: 'ansi',  // Special type for ANSI rendering
    converging: false,
    horizontal: false
  },
  
  // Background handled by ANSI renderer
  background: {
    type: 'ansi',
    config: {
      parallaxSpeed: 0.0  // No parallax - ANSI scrolls with track
    }
  },
  
  // No celestial body
  celestial: {
    type: 'none',
    size: 0,
    positionX: 0.5,
    positionY: 0.5
  },
  
  // Sparse digital stars
  stars: {
    enabled: true,
    density: 0.1,
    twinkle: true
  },
  
  // Dark cyber ground
  ground: {
    type: 'solid',
    primary: { fg: BLACK, bg: BG_BLACK },
    secondary: { fg: DARKGRAY, bg: BG_BLACK },
    pattern: {
      ditherDensity: 0.1,
      ditherChars: ['.', GLYPH.LIGHT_SHADE]
    }
  },
  
  // Minimal roadside - let ANSI dominate
  roadside: {
    pool: [
      { sprite: 'data_beacon', weight: 3, side: 'both' },
      { sprite: 'data_node', weight: 2, side: 'both' },
      { sprite: 'signal_pole', weight: 2, side: 'both' },
      { sprite: 'binary_pillar', weight: 3, side: 'both' }
    ],
    spacing: 60,  // Sparse - let ANSI show through
    density: 0.5
  },
  
  // Special HUD overrides for retro-modem theme
  hud: {
    speedLabel: 'Kbps',
    speedMultiplier: 0.24,  // 120 mph -> 28.8 Kbps
    positionPrefix: 'Node ',
    lapLabel: 'SECTOR',
    timeLabel: 'CONNECT'
  }
};

registerTheme(ANSITunnelTheme);

/**
 * ANSI Tunnel renderer - handles the perspective road surface and sky reflection.
 */
class ANSITunnelRenderer {
  private ansiImages: ANSIImage[] = [];
  private currentImageIndex: number = 0;
  private scrollOffset: number = 0;
  private loaded: boolean = false;
  
  constructor() {
    this.loadANSIFiles();
  }
  
  /**
   * Load ANSI files from the configured directory.
   */
  private loadANSIFiles(): void {
    var files = ANSILoader.scanDirectory(ANSITunnelConfig.directory);
    
    if (files.length === 0) {
      logWarning("ANSITunnelRenderer: No ANSI files found in " + ANSITunnelConfig.directory);
      return;
    }
    
    // Load a few files for variety
    var maxFiles = Math.min(files.length, 5);
    for (var i = 0; i < maxFiles; i++) {
      var img = ANSILoader.load(files[i], ANSITunnelConfig.directory);
      if (img) {
        this.ansiImages.push(img);
        logInfo("ANSITunnelRenderer: Loaded " + files[i] + " (" + img.width + "x" + img.height + ")");
      }
    }
    
    this.loaded = this.ansiImages.length > 0;
    logInfo("ANSITunnelRenderer: Loaded " + this.ansiImages.length + " ANSI images");
  }
  
  /**
   * Get the current ANSI image.
   */
  getCurrentImage(): ANSIImage | null {
    if (!this.loaded || this.ansiImages.length === 0) return null;
    return this.ansiImages[this.currentImageIndex % this.ansiImages.length];
  }
  
  /**
   * Update scroll position based on track progress.
   * @param trackZ - Current position on track
   * @param trackLength - Total track length
   */
  updateScroll(trackZ: number, trackLength: number): void {
    var img = this.getCurrentImage();
    if (!img) return;
    
    // Map track position to ANSI row
    // One full lap = one full scroll through the ANSI
    var progress = (trackZ % trackLength) / trackLength;
    this.scrollOffset = progress * img.height;
    
    // Switch images at lap boundaries (optional variety)
    var lapNumber = Math.floor(trackZ / trackLength);
    if (lapNumber !== this.currentImageIndex && this.ansiImages.length > 1) {
      this.currentImageIndex = lapNumber % this.ansiImages.length;
    }
  }
  
  /**
   * Render the ANSI tunnel effect to a frame.
   * @param frame - The frame to render to
   * @param horizonY - Y position of the horizon line
   * @param roadBottom - Y position of the road bottom
   * @param screenWidth - Width of the screen
   */
  renderTunnel(frame: Frame, horizonY: number, roadBottom: number, screenWidth: number): void {
    var img = this.getCurrentImage();
    if (!img) {
      // Fallback: render simple gradient
      this.renderFallback(frame, horizonY, roadBottom, screenWidth);
      return;
    }
    
    // Render sky (mirrored ANSI reflection)
    if (ANSITunnelConfig.mirrorSky) {
      this.renderSkyReflection(frame, img, horizonY, screenWidth);
    }
    
    // Render road surface (ANSI with perspective)
    this.renderRoadSurface(frame, img, horizonY, roadBottom, screenWidth);
  }
  
  /**
   * Render the sky area with mirrored ANSI content.
   */
  private renderSkyReflection(frame: Frame, img: ANSIImage, horizonY: number, screenWidth: number): void {
    // Sky goes from row 0 to horizonY
    for (var screenY = 0; screenY < horizonY; screenY++) {
      // Calculate which ANSI row to sample (inverted for mirror effect)
      var distFromHorizon = horizonY - screenY;
      var t = distFromHorizon / horizonY;  // 0 at horizon, 1 at top
      
      // Sample from ANSI - rows closer to horizon are from current scroll position
      // Rows at top are from further ahead in the ANSI
      var ansiRow = Math.floor(this.scrollOffset + t * 20) % img.height;
      if (ansiRow < 0) ansiRow += img.height;
      
      // Render with horizontal compression toward center (tunnel effect)
      var compression = 0.3 + t * 0.7;  // More compressed near horizon
      var centerX = screenWidth / 2;
      
      for (var screenX = 0; screenX < screenWidth; screenX++) {
        // Map screen X to ANSI X with compression
        var offsetFromCenter = screenX - centerX;
        var ansiX = Math.floor(centerX + offsetFromCenter / compression);
        
        if (ansiX >= 0 && ansiX < img.width && ansiRow >= 0 && ansiRow < img.height) {
          var cell = img.cells[ansiRow][ansiX];
          var attr = cell.attr;
          
          // Color shift for sky - make it more blue/cyan tinted
          if (ANSITunnelConfig.colorShift) {
            attr = this.shiftColorForSky(attr, t);
          }
          
          frame.setData(screenX, screenY, cell.char, attr);
        }
      }
    }
  }
  
  /**
   * Render the road surface with ANSI content and perspective.
   */
  private renderRoadSurface(frame: Frame, img: ANSIImage, horizonY: number, roadBottom: number, screenWidth: number): void {
    // Road goes from horizonY to roadBottom
    var roadHeight = roadBottom - horizonY;
    
    for (var screenY = horizonY; screenY < roadBottom; screenY++) {
      var rowInRoad = screenY - horizonY;
      var t = rowInRoad / roadHeight;  // 0 at horizon, 1 at bottom
      
      // Perspective: rows near bottom are from current scroll position
      // Rows near horizon are from further ahead
      var ansiRow = Math.floor(this.scrollOffset + (1 - t) * 30) % img.height;
      if (ansiRow < 0) ansiRow += img.height;
      
      // Horizontal expansion for perspective (wider at bottom)
      var expansion = 0.5 + t * 1.5;  // More expanded near car
      var centerX = screenWidth / 2;
      
      for (var screenX = 0; screenX < screenWidth; screenX++) {
        // Map screen X to ANSI X with expansion
        var offsetFromCenter = screenX - centerX;
        var ansiX = Math.floor(centerX + offsetFromCenter / expansion);
        
        if (ansiX >= 0 && ansiX < img.width && ansiRow >= 0 && ansiRow < img.height) {
          var cell = img.cells[ansiRow][ansiX];
          frame.setData(screenX, screenY, cell.char, cell.attr);
        }
      }
    }
  }
  
  /**
   * Shift colors for the sky reflection effect.
   */
  private shiftColorForSky(attr: number, t: number): number {
    var fg = attr & 0x0F;
    var bg = (attr >> 4) & 0x0F;
    
    // Shift toward cyan/blue tones
    // More shift further from horizon (higher t)
    if (t > 0.3) {
      // Make warm colors cooler
      if (fg === RED || fg === LIGHTRED) fg = MAGENTA;
      if (fg === YELLOW || fg === BROWN) fg = CYAN;
      if (fg === LIGHTGREEN || fg === GREEN) fg = LIGHTCYAN;
      if (fg === WHITE) fg = LIGHTCYAN;
      
      // Darken backgrounds
      if (bg > 0 && bg < 8) bg = 0;
    }
    
    // Fade more at the top
    if (t > 0.7) {
      if (fg >= 8) fg = fg - 8;  // Dim bright colors
    }
    
    return makeAttr(fg, bg << 4);
  }
  
  /**
   * Fallback rendering when no ANSI is loaded.
   */
  private renderFallback(frame: Frame, horizonY: number, roadBottom: number, screenWidth: number): void {
    // Simple cyber grid fallback
    var gridAttr = makeAttr(DARKGRAY, BG_BLACK);
    
    // Sky - simple gradient
    for (var y = 0; y < horizonY; y++) {
      var skyAttr = y < 2 ? makeAttr(BLACK, BG_BLACK) : makeAttr(DARKGRAY, BG_BLACK);
      for (var x = 0; x < screenWidth; x++) {
        frame.setData(x, y, ' ', skyAttr);
      }
    }
    
    // Road - simple lines
    for (var y = horizonY; y < roadBottom; y++) {
      for (var x = 0; x < screenWidth; x++) {
        var ch = (y + x) % 4 === 0 ? '.' : ' ';
        frame.setData(x, y, ch, gridAttr);
      }
    }
  }
  
  /**
   * Check if ANSI files are loaded.
   */
  isLoaded(): boolean {
    return this.loaded;
  }
}

// Singleton instance
var ansiTunnelRenderer: ANSITunnelRenderer | null = null;

function getANSITunnelRenderer(): ANSITunnelRenderer {
  if (!ansiTunnelRenderer) {
    ansiTunnelRenderer = new ANSITunnelRenderer();
  }
  return ansiTunnelRenderer;
}
