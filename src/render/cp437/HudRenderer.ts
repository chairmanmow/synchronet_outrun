/**
 * HudRenderer - Renders the heads-up display.
 */

class HudRenderer {
  private composer: SceneComposer;

  constructor(composer: SceneComposer) {
    this.composer = composer;
  }

  /**
   * Render complete HUD.
   */
  render(hudData: HudData): void {
    this.renderTopBar(hudData);
    this.renderLapProgress(hudData);
    this.renderSpeedometer(hudData);
    this.renderItemSlot(hudData);
    
    // Render countdown overlay if race hasn't started
    if (hudData.countdown > 0 && hudData.raceMode === RaceMode.GRAND_PRIX) {
      this.renderCountdown(hudData.countdown);
    }
    // Note: raceFinished overlay removed - now using dedicated results screen
  }

  /**
   * Render top information bar.
   */
  private renderTopBar(data: HudData): void {
    var y = 0;
    var valueAttr = colorToAttr(PALETTE.HUD_VALUE);
    var labelAttr = colorToAttr(PALETTE.HUD_LABEL);

    // Top bar background
    for (var x = 0; x < 80; x++) {
      this.composer.setCell(x, y, ' ', makeAttr(BLACK, BG_BLACK));
    }

    // Lap counter
    this.composer.writeString(2, y, "LAP", labelAttr);
    this.composer.writeString(6, y, data.lap + "/" + data.totalLaps, valueAttr);

    // Position
    this.composer.writeString(14, y, "POS", labelAttr);
    var posSuffix = PositionIndicator.getOrdinalSuffix(data.position);
    this.composer.writeString(18, y, data.position + posSuffix, valueAttr);

    // Time
    this.composer.writeString(26, y, "TIME", labelAttr);
    this.composer.writeString(31, y, LapTimer.format(data.lapTime), valueAttr);

    // Best lap
    if (data.bestLapTime > 0) {
      this.composer.writeString(45, y, "BEST", labelAttr);
      this.composer.writeString(50, y, LapTimer.format(data.bestLapTime), valueAttr);
    }

    // Speed (right side)
    this.composer.writeString(66, y, "SPD", labelAttr);
    var speedStr = this.padLeft(data.speed.toString(), 3);
    this.composer.writeString(70, y, speedStr, valueAttr);
  }

  /**
   * Render lap progress bar on row 1.
   */
  private renderLapProgress(data: HudData): void {
    var y = 1;
    var barX = 2;
    var barWidth = 60;

    var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
    var filledAttr = colorToAttr({ fg: CYAN, bg: BG_BLACK });
    var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
    var finishAttr = colorToAttr({ fg: WHITE, bg: BG_MAGENTA });

    // Row background
    for (var x = 0; x < 80; x++) {
      this.composer.setCell(x, y, ' ', makeAttr(BLACK, BG_BLACK));
    }

    // Progress label with percentage
    var pct = Math.floor(data.lapProgress * 100);
    var pctStr = this.padLeft(pct.toString(), 3) + "%";
    this.composer.writeString(barX, y, "TRACK", labelAttr);
    this.composer.writeString(barX + 6, y, pctStr, colorToAttr(PALETTE.HUD_VALUE));

    // Progress bar
    var barStartX = barX + 12;
    this.composer.setCell(barStartX, y, '[', labelAttr);

    var fillWidth = Math.floor(data.lapProgress * barWidth);

    for (var i = 0; i < barWidth; i++) {
      var isFinish = (i === barWidth - 1);  // Last position is finish line
      var attr: number;
      var char: string;

      if (isFinish) {
        // Checkered flag at finish
        attr = finishAttr;
        char = GLYPH.CHECKER;
      } else if (i < fillWidth) {
        attr = filledAttr;
        char = GLYPH.FULL_BLOCK;
      } else {
        attr = emptyAttr;
        char = GLYPH.LIGHT_SHADE;
      }

      this.composer.setCell(barStartX + 1 + i, y, char, attr);
    }

    this.composer.setCell(barStartX + barWidth + 1, y, ']', labelAttr);

    // Show finish flag icon at end
    this.composer.writeString(barStartX + barWidth + 3, y, "FINISH", finishAttr);
  }

  /**
   * Render graphical speedometer.
   */
  private renderSpeedometer(data: HudData): void {
    var y = 23;
    var barX = 2;
    var barWidth = 20;

    var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
    var filledAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
    var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
    var highAttr = colorToAttr({ fg: LIGHTRED, bg: BG_BLACK });

    this.composer.writeString(barX, y, "[", labelAttr);

    var fillAmount = data.speed / data.speedMax;
    var fillWidth = Math.round(fillAmount * barWidth);

    for (var i = 0; i < barWidth; i++) {
      var attr = i < fillWidth ?
        (fillAmount > 0.8 ? highAttr : filledAttr) :
        emptyAttr;
      var char = i < fillWidth ? GLYPH.FULL_BLOCK : GLYPH.LIGHT_SHADE;
      this.composer.setCell(barX + 1 + i, y, char, attr);
    }

    this.composer.writeString(barX + barWidth + 1, y, "]", labelAttr);
  }

  /**
   * Render held item slot.
   */
  private renderItemSlot(data: HudData): void {
    var y = 23;
    var x = 70;

    var frameAttr = colorToAttr(PALETTE.HUD_FRAME);

    this.composer.setCell(x, y, '[', frameAttr);
    this.composer.setCell(x + 5, y, ']', frameAttr);

    if (data.heldItem !== null) {
      var itemAttr: number;
      var itemChar: string;

      switch (data.heldItem) {
        case ItemType.MUSHROOM:
          itemAttr = colorToAttr(PALETTE.ITEM_MUSHROOM);
          itemChar = 'MUSH';
          break;
        case ItemType.SHELL:
          itemAttr = colorToAttr(PALETTE.ITEM_SHELL);
          itemChar = 'SHEL';
          break;
        default:
          itemAttr = colorToAttr(PALETTE.HUD_VALUE);
          itemChar = 'ITEM';
      }

      this.composer.writeString(x + 1, y, itemChar, itemAttr);
    } else {
      this.composer.writeString(x + 1, y, "----", colorToAttr(PALETTE.HUD_LABEL));
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
   * Render stoplight countdown graphic in center of screen.
   */
  private renderCountdown(countdown: number): void {
    var countNum = Math.ceil(countdown);
    var centerX = 40;
    var topY = 8;
    
    // Stoplight frame colors
    var frameAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
    var poleAttr = colorToAttr({ fg: BROWN, bg: BG_BLACK });
    
    // Light states based on countdown
    var redOn = countNum >= 3;
    var yellowOn = countNum === 2;
    var greenOn = countNum <= 1;
    
    // Light colors (on vs off)
    var redAttr = redOn ? colorToAttr({ fg: LIGHTRED, bg: BG_RED }) : colorToAttr({ fg: RED, bg: BG_BLACK });
    var yellowAttr = yellowOn ? colorToAttr({ fg: YELLOW, bg: BG_BROWN }) : colorToAttr({ fg: BROWN, bg: BG_BLACK });
    var greenAttr = greenOn ? colorToAttr({ fg: LIGHTGREEN, bg: BG_GREEN }) : colorToAttr({ fg: GREEN, bg: BG_BLACK });
    
    // Stoplight housing (7 chars wide, 9 rows tall)
    var boxX = centerX - 3;
    
    // Top of housing
    this.composer.setCell(boxX, topY, GLYPH.DBOX_TL, frameAttr);
    for (var i = 1; i < 6; i++) {
      this.composer.setCell(boxX + i, topY, GLYPH.DBOX_H, frameAttr);
    }
    this.composer.setCell(boxX + 6, topY, GLYPH.DBOX_TR, frameAttr);
    
    // RED light row (row 1-2)
    this.composer.setCell(boxX, topY + 1, GLYPH.DBOX_V, frameAttr);
    this.composer.writeString(boxX + 1, topY + 1, " ", frameAttr);
    this.composer.setCell(boxX + 2, topY + 1, GLYPH.FULL_BLOCK, redAttr);
    this.composer.setCell(boxX + 3, topY + 1, GLYPH.FULL_BLOCK, redAttr);
    this.composer.setCell(boxX + 4, topY + 1, GLYPH.FULL_BLOCK, redAttr);
    this.composer.writeString(boxX + 5, topY + 1, " ", frameAttr);
    this.composer.setCell(boxX + 6, topY + 1, GLYPH.DBOX_V, frameAttr);
    
    // Separator
    this.composer.setCell(boxX, topY + 2, GLYPH.DBOX_V, frameAttr);
    this.composer.writeString(boxX + 1, topY + 2, "     ", frameAttr);
    this.composer.setCell(boxX + 6, topY + 2, GLYPH.DBOX_V, frameAttr);
    
    // YELLOW light row (row 3-4)
    this.composer.setCell(boxX, topY + 3, GLYPH.DBOX_V, frameAttr);
    this.composer.writeString(boxX + 1, topY + 3, " ", frameAttr);
    this.composer.setCell(boxX + 2, topY + 3, GLYPH.FULL_BLOCK, yellowAttr);
    this.composer.setCell(boxX + 3, topY + 3, GLYPH.FULL_BLOCK, yellowAttr);
    this.composer.setCell(boxX + 4, topY + 3, GLYPH.FULL_BLOCK, yellowAttr);
    this.composer.writeString(boxX + 5, topY + 3, " ", frameAttr);
    this.composer.setCell(boxX + 6, topY + 3, GLYPH.DBOX_V, frameAttr);
    
    // Separator
    this.composer.setCell(boxX, topY + 4, GLYPH.DBOX_V, frameAttr);
    this.composer.writeString(boxX + 1, topY + 4, "     ", frameAttr);
    this.composer.setCell(boxX + 6, topY + 4, GLYPH.DBOX_V, frameAttr);
    
    // GREEN light row (row 5-6)
    this.composer.setCell(boxX, topY + 5, GLYPH.DBOX_V, frameAttr);
    this.composer.writeString(boxX + 1, topY + 5, " ", frameAttr);
    this.composer.setCell(boxX + 2, topY + 5, GLYPH.FULL_BLOCK, greenAttr);
    this.composer.setCell(boxX + 3, topY + 5, GLYPH.FULL_BLOCK, greenAttr);
    this.composer.setCell(boxX + 4, topY + 5, GLYPH.FULL_BLOCK, greenAttr);
    this.composer.writeString(boxX + 5, topY + 5, " ", frameAttr);
    this.composer.setCell(boxX + 6, topY + 5, GLYPH.DBOX_V, frameAttr);
    
    // Bottom of housing
    this.composer.setCell(boxX, topY + 6, GLYPH.DBOX_BL, frameAttr);
    for (var j = 1; j < 6; j++) {
      this.composer.setCell(boxX + j, topY + 6, GLYPH.DBOX_H, frameAttr);
    }
    this.composer.setCell(boxX + 6, topY + 6, GLYPH.DBOX_BR, frameAttr);
    
    // Pole below stoplight
    this.composer.setCell(centerX, topY + 7, GLYPH.DBOX_V, poleAttr);
    this.composer.setCell(centerX, topY + 8, GLYPH.DBOX_V, poleAttr);
    
    // "GO!" text when green
    if (greenOn && countNum <= 0) {
      var goAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
      this.composer.writeString(centerX - 2, topY + 9, "GO!!!", goAttr);
    }
  }
}
