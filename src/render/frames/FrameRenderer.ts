/**
 * FrameRenderer - Main renderer using Frame.js layered architecture.
 * 
 * Replaces the old cell-by-cell SceneComposer approach with proper
 * frame-based rendering for efficiency and correct z-ordering.
 * 
 * Implements IRenderer interface for drop-in replacement of old Renderer.
 */

class FrameRenderer implements IRenderer {
  private frameManager: FrameManager;
  private width: number;
  private height: number;
  private horizonY: number;
  
  // Pre-built sprites
  private treeSprite: SpriteDefinition;
  private rockSprite: SpriteDefinition;
  private bushSprite: SpriteDefinition;
  private playerCarSprite: SpriteDefinition;
  
  // Parallax state (placeholders for future scrolling)
  private _mountainScrollOffset: number;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.horizonY = 8;
    
    this._mountainScrollOffset = 0;
    
    this.frameManager = new FrameManager(width, height, this.horizonY);
    
    // Initialize sprites (will be fully created after frame.js loads)
    this.treeSprite = null as any;
    this.rockSprite = null as any;
    this.bushSprite = null as any;
    this.playerCarSprite = null as any;
  }
  
  /**
   * Initialize the renderer. Must be called once at startup.
   */
  init(): void {
    // Load frame.js
    load('frame.js');
    
    // Initialize frame manager
    this.frameManager.init();
    
    // Build sprite sheets
    this.treeSprite = SpriteSheet.createTree();
    this.rockSprite = SpriteSheet.createRock();
    this.bushSprite = SpriteSheet.createBush();
    this.playerCarSprite = SpriteSheet.createPlayerCar();
    
    // Render static elements
    this.renderSun();
    this.renderMountains();
    
    logInfo('FrameRenderer initialized with layered Frame.js architecture');
  }
  
  // ============================================================
  // IRenderer interface implementation
  // ============================================================
  
  /**
   * Begin a new frame - no-op for Frame.js (we update in place).
   */
  beginFrame(): void {
    // Frame.js doesn't need explicit begin - we update frames in place
  }
  
  /**
   * Render sky (IRenderer interface).
   */
  renderSky(trackPosition: number, curvature?: number, playerSteer?: number, speed?: number, dt?: number): void {
    // Update animated sky grid
    this.renderSkyGrid(trackPosition);
    
    // Update parallax (if params provided)
    if (curvature !== undefined && playerSteer !== undefined && speed !== undefined && dt !== undefined) {
      this.updateParallax(curvature, playerSteer, speed, dt);
    }
  }
  
  /**
   * Render road (IRenderer interface).
   */
  renderRoad(trackPosition: number, cameraX: number, _track: ITrack, road: Road): void {
    // Render road surface
    this.renderRoadSurface(trackPosition, cameraX, road.totalLength);
    
    // Build roadside objects from track/road
    var roadsideObjects = this.buildRoadsideObjects(trackPosition, cameraX, road);
    this.renderRoadsideSprites(roadsideObjects);
  }
  
  /**
   * Build roadside object list from road data.
   */
  private buildRoadsideObjects(trackPosition: number, cameraX: number, road: Road): { x: number; y: number; distance: number; type: string }[] {
    var objects: { x: number; y: number; distance: number; type: string }[] = [];
    var roadBottom = this.height - 1;
    var viewDistance = 12;  // How far ahead we can see
    
    // Sample road segments and place objects
    for (var dist = 1; dist < viewDistance; dist += 0.5) {
      var worldZ = trackPosition + dist;
      var segment = road.getSegment(worldZ);
      if (!segment) continue;
      
      // Calculate screen Y based on distance
      var t = 1 - (dist / viewDistance);
      var screenY = this.horizonY + Math.round(t * (roadBottom - this.horizonY));
      
      // Calculate screen X offset based on curvature and camera
      var curvatureOffset = segment.curve * dist * 5;
      var baseX = 40 - cameraX * 2 - curvatureOffset;
      
      // Add trees on both sides (sparse)
      if (Math.floor(worldZ) % 8 === 0) {
        // Left side
        var leftX = baseX - 25 - Math.random() * 5;
        if (leftX >= 0 && leftX < 20) {
          objects.push({ x: leftX, y: screenY, distance: dist, type: 'tree' });
        }
        // Right side
        var rightX = baseX + 25 + Math.random() * 5;
        if (rightX >= 60 && rightX < 80) {
          objects.push({ x: rightX, y: screenY, distance: dist, type: 'tree' });
        }
      }
      
      // Add rocks (less frequent)
      if (Math.floor(worldZ) % 12 === 4) {
        var rockX = baseX + (Math.random() > 0.5 ? 30 : -30);
        if (rockX >= 0 && rockX < 80) {
          objects.push({ x: rockX, y: screenY, distance: dist, type: 'rock' });
        }
      }
      
      // Add bushes (more frequent)
      if (Math.floor(worldZ) % 5 === 0) {
        var bushX = baseX + (Math.random() > 0.5 ? 22 : -22);
        if (bushX >= 0 && bushX < 80) {
          objects.push({ x: bushX, y: screenY, distance: dist, type: 'bush' });
        }
      }
    }
    
    // Sort by distance (far to near) for proper z-ordering
    objects.sort(function(a, b) { return b.distance - a.distance; });
    
    return objects;
  }
  
  /**
   * Render entities (IRenderer interface).
   */
  renderEntities(playerVehicle: IVehicle, _vehicles: IVehicle[], _items: Item[]): void {
    // TODO: Render AI vehicles and items
    // For now just render player vehicle
    this.renderPlayerVehicle(playerVehicle.x);
  }
  
  /**
   * End frame - push updates to screen.
   */
  endFrame(): void {
    this.cycle();
  }
  
  // ============================================================
  // Internal rendering methods  
  // ============================================================

  /**
   * Render the sun to its frame (static, rendered once).
   */
  private renderSun(): void {
    var sunFrame = this.frameManager.getSunFrame();
    if (!sunFrame) return;
    
    var sunCoreAttr = makeAttr(YELLOW, BG_RED);
    var sunGlowAttr = makeAttr(LIGHTRED, BG_BLACK);
    
    // Sun position in frame (centered horizontally, near bottom)
    var sunX = Math.floor(this.width / 2) - 3;
    var sunY = this.horizonY - 5;
    
    // Draw sun core (5x3)
    for (var dy = 0; dy < 3; dy++) {
      for (var dx = 0; dx < 5; dx++) {
        sunFrame.setData(sunX + dx, sunY + dy, GLYPH.FULL_BLOCK, sunCoreAttr);
      }
    }
    
    // Draw glow around edges
    var glowChar = GLYPH.DARK_SHADE;
    // Top edge
    for (var x = sunX - 1; x <= sunX + 5; x++) {
      sunFrame.setData(x, sunY - 1, glowChar, sunGlowAttr);
    }
    // Bottom edge
    for (var x = sunX - 1; x <= sunX + 5; x++) {
      sunFrame.setData(x, sunY + 3, glowChar, sunGlowAttr);
    }
    // Side edges
    sunFrame.setData(sunX - 1, sunY, glowChar, sunGlowAttr);
    sunFrame.setData(sunX - 1, sunY + 1, glowChar, sunGlowAttr);
    sunFrame.setData(sunX - 1, sunY + 2, glowChar, sunGlowAttr);
    sunFrame.setData(sunX + 5, sunY, glowChar, sunGlowAttr);
    sunFrame.setData(sunX + 5, sunY + 1, glowChar, sunGlowAttr);
    sunFrame.setData(sunX + 5, sunY + 2, glowChar, sunGlowAttr);
  }
  
  /**
   * Render mountains to their frame (can be scrolled for parallax).
   */
  private renderMountains(): void {
    var frame = this.frameManager.getMountainsFrame();
    if (!frame) return;
    
    var mountainAttr = colorToAttr(PALETTE.MOUNTAIN);
    var highlightAttr = colorToAttr(PALETTE.MOUNTAIN_HIGHLIGHT);
    
    // Mountain silhouettes at horizon
    var mountains = [
      { x: 5, height: 4, width: 12 },
      { x: 20, height: 6, width: 16 },
      { x: 42, height: 5, width: 14 },
      { x: 60, height: 4, width: 10 },
      { x: 72, height: 3, width: 8 }
    ];
    
    for (var i = 0; i < mountains.length; i++) {
      this.drawMountainToFrame(frame, mountains[i].x, this.horizonY - 1, 
                               mountains[i].height, mountains[i].width,
                               mountainAttr, highlightAttr);
    }
  }
  
  /**
   * Draw a single mountain shape to a frame.
   */
  private drawMountainToFrame(frame: Frame, baseX: number, baseY: number, 
                               height: number, width: number,
                               attr: number, highlightAttr: number): void {
    var peakX = baseX + Math.floor(width / 2);
    
    for (var h = 0; h < height; h++) {
      var y = baseY - h;
      if (y < 0) continue;
      
      var halfWidth = Math.floor((height - h) * width / height / 2);
      
      // Draw mountain row
      for (var dx = -halfWidth; dx <= halfWidth; dx++) {
        var x = peakX + dx;
        if (x >= 0 && x < this.width) {
          if (dx < 0) {
            frame.setData(x, y, '/', attr);
          } else if (dx > 0) {
            frame.setData(x, y, '\\', attr);
          } else {
            // Peak
            if (h === height - 1) {
              frame.setData(x, y, GLYPH.TRIANGLE_UP, highlightAttr);
            } else {
              frame.setData(x, y, GLYPH.BOX_V, attr);
            }
          }
        }
      }
    }
  }
  
  /**
   * Update sky grid animation (called each frame).
   */
  renderSkyGrid(trackPosition: number): void {
    var frame = this.frameManager.getSkyGridFrame();
    if (!frame) return;
    
    frame.clear();
    
    var gridAttr = colorToAttr(PALETTE.SKY_GRID);
    var glowAttr = colorToAttr(PALETTE.SKY_GRID_GLOW);
    var vanishX = 40;
    
    for (var y = this.horizonY - 1; y >= 1; y--) {
      var distFromHorizon = this.horizonY - y;
      var spread = distFromHorizon * 6;
      
      // Vertical converging lines
      for (var offset = 0; offset <= spread && offset < 40; offset += 10) {
        if (offset === 0) {
          frame.setData(vanishX, y, GLYPH.BOX_V, gridAttr);
        } else {
          var leftX = vanishX - offset;
          var rightX = vanishX + offset;
          if (leftX >= 0) frame.setData(leftX, y, '/', glowAttr);
          if (rightX < this.width) frame.setData(rightX, y, '\\', glowAttr);
        }
      }
      
      // Horizontal lines (animated)
      var linePhase = Math.floor(trackPosition / 50 + distFromHorizon) % 4;
      if (linePhase === 0) {
        var lineSpread = Math.min(spread, 38);
        for (var x = vanishX - lineSpread; x <= vanishX + lineSpread; x++) {
          if (x >= 0 && x < this.width) {
            frame.setData(x, y, GLYPH.BOX_H, glowAttr);
          }
        }
      }
    }
  }
  
  /**
   * Update parallax scroll based on steering/curvature.
   */
  updateParallax(curvature: number, steer: number, speed: number, dt: number): void {
    var scrollAmount = (curvature * 0.8 + steer * 0.2) * speed * dt * 0.1;
    this._mountainScrollOffset += scrollAmount * 0.3;  // Mountains scroll slower

    // For now we don't actually scroll the frame - would need wider buffer
    // This is a placeholder for future enhancement
  }
  
  /**
   * Render the road surface to its frame (internal method).
   */
  private renderRoadSurface(trackPosition: number, cameraX: number, roadLength: number): void {
    var frame = this.frameManager.getRoadFrame();
    if (!frame) return;
    
    frame.clear();
    
    var roadBottom = this.height - this.horizonY - 1;  // Frame-relative Y
    
    for (var screenY = roadBottom; screenY >= 0; screenY--) {
      var t = (roadBottom - screenY) / roadBottom;
      var distance = 1 / (1 - t * 0.95);
      
      // Road width narrows with distance
      var roadWidth = Math.round(40 / distance);
      var halfWidth = Math.floor(roadWidth / 2);
      
      var centerX = 40 - Math.round(cameraX * 0.5);
      var leftEdge = centerX - halfWidth;
      var rightEdge = centerX + halfWidth;
      
      // Stripe phase for animated dashes
      var stripePhase = Math.floor((trackPosition + distance * 5) / 15) % 2;
      
      // Check finish line
      var worldZ = trackPosition + distance * 5;
      var wrappedZ = worldZ % roadLength;
      if (wrappedZ < 0) wrappedZ += roadLength;
      var isFinishLine = (wrappedZ < 200) || (wrappedZ > roadLength - 200);
      
      this.renderRoadScanline(frame, screenY, centerX, leftEdge, rightEdge, 
                              distance, stripePhase, isFinishLine);
    }
  }
  
  /**
   * Render a single road scanline.
   */
  private renderRoadScanline(frame: Frame, y: number, centerX: number,
                              leftEdge: number, rightEdge: number,
                              distance: number, stripePhase: number,
                              isFinishLine: boolean): void {
    var roadAttr = colorToAttr(distance < 10 ? PALETTE.ROAD_LIGHT : PALETTE.ROAD_DARK);
    var gridAttr = colorToAttr(PALETTE.ROAD_GRID);
    var edgeAttr = colorToAttr(PALETTE.ROAD_EDGE);
    var stripeAttr = colorToAttr(PALETTE.ROAD_STRIPE);
    var dirtAttr = colorToAttr(PALETTE.OFFROAD_DIRT);
    
    for (var x = 0; x < this.width; x++) {
      if (x >= leftEdge && x <= rightEdge) {
        // On road
        if (isFinishLine) {
          this.renderFinishCell(frame, x, y, centerX, leftEdge, rightEdge, distance);
        } else if (x === leftEdge || x === rightEdge) {
          frame.setData(x, y, GLYPH.BOX_V, edgeAttr);
        } else if (Math.abs(x - centerX) < 1 && stripePhase === 0) {
          frame.setData(x, y, GLYPH.BOX_V, stripeAttr);
        } else {
          var gridPhase = Math.floor(distance) % 3;
          if (gridPhase === 0 && distance > 5) {
            frame.setData(x, y, GLYPH.BOX_H, gridAttr);
          } else {
            frame.setData(x, y, ' ', roadAttr);
          }
        }
      } else {
        // Off road - dirt edge
        var distFromRoad = (x < leftEdge) ? leftEdge - x : x - rightEdge;
        if (distFromRoad <= 2) {
          frame.setData(x, y, GLYPH.GRASS, dirtAttr);
        }
        // Further off-road is black (default)
      }
    }
  }
  
  /**
   * Render finish line cell.
   */
  private renderFinishCell(frame: Frame, x: number, y: number, 
                           centerX: number, leftEdge: number, rightEdge: number,
                           distance: number): void {
    if (x === leftEdge || x === rightEdge) {
      frame.setData(x, y, GLYPH.BOX_V, makeAttr(WHITE, BG_BLACK));
      return;
    }
    
    var checkerSize = Math.max(1, Math.floor(3 / distance));
    var checkerX = Math.floor((x - centerX) / checkerSize);
    var checkerY = Math.floor(y / 2);
    var isWhite = ((checkerX + checkerY) % 2) === 0;
    
    if (isWhite) {
      frame.setData(x, y, GLYPH.FULL_BLOCK, makeAttr(WHITE, BG_LIGHTGRAY));
    } else {
      frame.setData(x, y, ' ', makeAttr(BLACK, BG_BLACK));
    }
  }
  
  /**
   * Render roadside sprites using the sprite pool.
   * Called with list of visible roadside objects.
   */
  renderRoadsideSprites(objects: { x: number; y: number; distance: number; type: string }[]): void {
    // Sort by distance (far to near) for proper z-order
    objects.sort(function(a, b) { return b.distance - a.distance; });
    
    var poolSize = this.frameManager.getRoadsidePoolSize();
    var used = 0;
    
    for (var i = 0; i < objects.length && used < poolSize; i++) {
      var obj = objects[i];
      var spriteFrame = this.frameManager.getRoadsideFrame(used);
      if (!spriteFrame) continue;
      
      // Select sprite and scale based on type and distance
      var sprite: SpriteDefinition;
      if (obj.type === 'tree') {
        sprite = this.treeSprite;
      } else if (obj.type === 'rock') {
        sprite = this.rockSprite;
      } else {
        sprite = this.bushSprite;
      }
      
      // Scale index based on distance
      var scaleIndex = this.getScaleForDistance(obj.distance);
      
      // Render sprite to frame
      renderSpriteToFrame(spriteFrame, sprite, scaleIndex);
      
      // Position frame
      var size = getSpriteSize(sprite, scaleIndex);
      var frameX = Math.round(obj.x - size.width / 2);
      var frameY = Math.round(obj.y - size.height + 1);
      
      this.frameManager.positionRoadsideFrame(used, frameX, frameY, true);
      used++;
    }
    
    // Hide unused frames
    for (var j = used; j < poolSize; j++) {
      this.frameManager.positionRoadsideFrame(j, 0, 0, false);
    }
  }
  
  /**
   * Get sprite scale index for a given distance.
   */
  private getScaleForDistance(distance: number): number {
    if (distance > 8) return 0;
    if (distance > 5) return 1;
    if (distance > 3) return 2;
    if (distance > 1.5) return 3;
    return 4;
  }
  
  /**
   * Render player vehicle.
   */
  renderPlayerVehicle(playerX: number): void {
    var frame = this.frameManager.getVehicleFrame(0);
    if (!frame) return;
    
    renderSpriteToFrame(frame, this.playerCarSprite, 0);
    
    // Player is always at bottom center-ish
    var screenX = 40 + Math.round(playerX * 5) - 2;
    var screenY = this.height - 3;
    
    this.frameManager.positionVehicleFrame(0, screenX, screenY, true);
  }
  
  /**
   * Render HUD elements.
   */
  renderHud(hudData: HudData): void {
    var frame = this.frameManager.getHudFrame();
    if (!frame) return;
    
    frame.clear();
    
    var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
    var valueAttr = colorToAttr(PALETTE.HUD_VALUE);
    
    // Top bar - Lap, Position, Time
    this.writeStringToFrame(frame, 2, 0, 'LAP', labelAttr);
    this.writeStringToFrame(frame, 6, 0, hudData.lap + '/' + hudData.totalLaps, valueAttr);
    
    this.writeStringToFrame(frame, 14, 0, 'POS', labelAttr);
    this.writeStringToFrame(frame, 18, 0, hudData.position + PositionIndicator.getOrdinalSuffix(hudData.position), valueAttr);
    
    this.writeStringToFrame(frame, 26, 0, 'TIME', labelAttr);
    this.writeStringToFrame(frame, 31, 0, LapTimer.format(hudData.lapTime), valueAttr);
    
    this.writeStringToFrame(frame, 66, 0, 'SPD', labelAttr);
    this.writeStringToFrame(frame, 70, 0, this.padLeft(hudData.speed.toString(), 3), valueAttr);
    
    // Speedometer bar at bottom
    this.renderSpeedometerBar(frame, hudData.speed, hudData.speedMax);
  }
  
  /**
   * Render speedometer bar.
   */
  private renderSpeedometerBar(frame: Frame, speed: number, maxSpeed: number): void {
    var y = this.height - 1;
    var barX = 2;
    var barWidth = 20;
    
    var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
    var filledAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
    var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
    var highAttr = colorToAttr({ fg: LIGHTRED, bg: BG_BLACK });
    
    frame.setData(barX, y, '[', labelAttr);
    
    var fillAmount = speed / maxSpeed;
    var fillWidth = Math.round(fillAmount * barWidth);
    
    for (var i = 0; i < barWidth; i++) {
      var attr = (i < fillWidth) ? (fillAmount > 0.8 ? highAttr : filledAttr) : emptyAttr;
      var char = (i < fillWidth) ? GLYPH.FULL_BLOCK : GLYPH.LIGHT_SHADE;
      frame.setData(barX + 1 + i, y, char, attr);
    }
    
    frame.setData(barX + barWidth + 1, y, ']', labelAttr);
  }
  
  /**
   * Helper to write a string to a frame.
   */
  private writeStringToFrame(frame: Frame, x: number, y: number, str: string, attr: number): void {
    for (var i = 0; i < str.length; i++) {
      frame.setData(x + i, y, str.charAt(i), attr);
    }
  }
  
  /**
   * Pad string on left.
   */
  private padLeft(str: string, len: number): string {
    while (str.length < len) {
      str = ' ' + str;
    }
    return str;
  }
  
  /**
   * Cycle all frames - push updates to screen.
   */
  cycle(): void {
    this.frameManager.cycle();
  }
  
  /**
   * Shutdown renderer.
   */
  shutdown(): void {
    this.frameManager.shutdown();
    console.clear();
  }
}
