"use strict";
var HudRenderer = (function () {
    function HudRenderer(composer) {
        this.composer = composer;
    }
    HudRenderer.prototype.render = function (hudData) {
        this.renderTopBar(hudData);
        this.renderLapProgress(hudData);
        this.renderSpeedometer(hudData);
        this.renderItemSlot(hudData);
        if (hudData.countdown > 0 && hudData.raceMode === RaceMode.GRAND_PRIX) {
            this.renderCountdown(hudData.countdown);
        }
    };
    HudRenderer.prototype.renderTopBar = function (data) {
        var y = 0;
        var valueAttr = colorToAttr(PALETTE.HUD_VALUE);
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        for (var x = 0; x < 80; x++) {
            this.composer.setCell(x, y, ' ', makeAttr(BLACK, BG_BLACK));
        }
        this.composer.writeString(2, y, "LAP", labelAttr);
        this.composer.writeString(6, y, data.lap + "/" + data.totalLaps, valueAttr);
        this.composer.writeString(14, y, "POS", labelAttr);
        var posSuffix = PositionIndicator.getOrdinalSuffix(data.position);
        this.composer.writeString(18, y, data.position + posSuffix, valueAttr);
        this.composer.writeString(26, y, "TIME", labelAttr);
        this.composer.writeString(31, y, LapTimer.format(data.lapTime), valueAttr);
        if (data.bestLapTime > 0) {
            this.composer.writeString(45, y, "BEST", labelAttr);
            this.composer.writeString(50, y, LapTimer.format(data.bestLapTime), valueAttr);
        }
        this.composer.writeString(66, y, "SPD", labelAttr);
        var speedStr = this.padLeft(data.speed.toString(), 3);
        this.composer.writeString(70, y, speedStr, valueAttr);
    };
    HudRenderer.prototype.renderLapProgress = function (data) {
        var y = 1;
        var barX = 2;
        var barWidth = 60;
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        var filledAttr = colorToAttr({ fg: CYAN, bg: BG_BLACK });
        var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
        var finishAttr = colorToAttr({ fg: WHITE, bg: BG_MAGENTA });
        for (var x = 0; x < 80; x++) {
            this.composer.setCell(x, y, ' ', makeAttr(BLACK, BG_BLACK));
        }
        var pct = Math.floor(data.lapProgress * 100);
        var pctStr = this.padLeft(pct.toString(), 3) + "%";
        this.composer.writeString(barX, y, "TRACK", labelAttr);
        this.composer.writeString(barX + 6, y, pctStr, colorToAttr(PALETTE.HUD_VALUE));
        var barStartX = barX + 12;
        this.composer.setCell(barStartX, y, '[', labelAttr);
        var fillWidth = Math.floor(data.lapProgress * barWidth);
        for (var i = 0; i < barWidth; i++) {
            var isFinish = (i === barWidth - 1);
            var attr;
            var char;
            if (isFinish) {
                attr = finishAttr;
                char = GLYPH.CHECKER;
            }
            else if (i < fillWidth) {
                attr = filledAttr;
                char = GLYPH.FULL_BLOCK;
            }
            else {
                attr = emptyAttr;
                char = GLYPH.LIGHT_SHADE;
            }
            this.composer.setCell(barStartX + 1 + i, y, char, attr);
        }
        this.composer.setCell(barStartX + barWidth + 1, y, ']', labelAttr);
        this.composer.writeString(barStartX + barWidth + 3, y, "FINISH", finishAttr);
    };
    HudRenderer.prototype.renderSpeedometer = function (data) {
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
    };
    HudRenderer.prototype.renderItemSlot = function (data) {
        var bottomY = 23;
        var rightEdge = 79;
        if (data.heldItem === null) {
            var emptyAttr = colorToAttr(PALETTE.HUD_LABEL);
            this.composer.writeString(rightEdge - 3, bottomY, "----", emptyAttr);
            return;
        }
        var itemType = data.heldItem.type;
        var uses = data.heldItem.uses;
        var icon = this.getItemIcon(itemType);
        var iconWidth = icon.lines[0].length;
        var iconHeight = icon.lines.length;
        var iconX = rightEdge - iconWidth + 1;
        var iconY = bottomY - iconHeight + 1;
        for (var row = 0; row < iconHeight; row++) {
            var line = icon.lines[row];
            for (var col = 0; col < line.length; col++) {
                var ch = line.charAt(col);
                if (ch !== ' ') {
                    var attr = this.getIconCharAttr(ch, icon, itemType);
                    this.composer.setCell(iconX + col, iconY + row, ch, attr);
                }
            }
        }
        if (uses > 1) {
            var countAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
            this.composer.setCell(iconX - 2, bottomY, 'x', colorToAttr(PALETTE.HUD_LABEL));
            this.composer.setCell(iconX - 1, bottomY, String(uses).charAt(0), countAttr);
        }
    };
    HudRenderer.prototype.getItemIcon = function (type) {
        switch (type) {
            case ItemType.MUSHROOM:
            case ItemType.MUSHROOM_TRIPLE:
                return {
                    lines: [
                        ' @@ ',
                        '@##@',
                        ' || '
                    ],
                    color: { fg: LIGHTRED, bg: BG_BLACK },
                    altColor: { fg: WHITE, bg: BG_BLACK }
                };
            case ItemType.MUSHROOM_GOLDEN:
                return {
                    lines: [
                        ' @@ ',
                        '@##@',
                        ' || '
                    ],
                    color: { fg: YELLOW, bg: BG_BLACK },
                    altColor: { fg: WHITE, bg: BG_BLACK }
                };
            case ItemType.GREEN_SHELL:
            case ItemType.GREEN_SHELL_TRIPLE:
                return {
                    lines: [
                        ' /^\\ ',
                        '(O O)',
                        ' \\_/ '
                    ],
                    color: { fg: LIGHTGREEN, bg: BG_BLACK }
                };
            case ItemType.RED_SHELL:
            case ItemType.RED_SHELL_TRIPLE:
            case ItemType.SHELL:
            case ItemType.SHELL_TRIPLE:
                return {
                    lines: [
                        ' /^\\ ',
                        '(O O)',
                        ' \\_/ '
                    ],
                    color: { fg: LIGHTRED, bg: BG_BLACK }
                };
            case ItemType.BLUE_SHELL:
                return {
                    lines: [
                        ' ~*~ ',
                        '<(@)>',
                        ' \\_/ '
                    ],
                    color: { fg: LIGHTBLUE, bg: BG_BLACK },
                    altColor: { fg: LIGHTCYAN, bg: BG_BLACK }
                };
            case ItemType.BANANA:
            case ItemType.BANANA_TRIPLE:
                return {
                    lines: [
                        '  /\\ ',
                        ' (  )',
                        '  \\/ '
                    ],
                    color: { fg: YELLOW, bg: BG_BLACK }
                };
            case ItemType.STAR:
                return {
                    lines: [
                        '  *  ',
                        ' *** ',
                        '*****',
                        ' * * '
                    ],
                    color: { fg: YELLOW, bg: BG_BLACK }
                };
            case ItemType.LIGHTNING:
                return {
                    lines: [
                        ' /| ',
                        '/-\' ',
                        '|/  '
                    ],
                    color: { fg: YELLOW, bg: BG_BLACK },
                    altColor: { fg: LIGHTCYAN, bg: BG_BLACK }
                };
            case ItemType.BULLET:
                return {
                    lines: [
                        ' __ ',
                        '|==>',
                        ' -- '
                    ],
                    color: { fg: WHITE, bg: BG_BLACK },
                    altColor: { fg: DARKGRAY, bg: BG_BLACK }
                };
            default:
                return {
                    lines: [
                        ' ? '
                    ],
                    color: { fg: YELLOW, bg: BG_BLACK }
                };
        }
    };
    HudRenderer.prototype.getIconCharAttr = function (ch, icon, itemType) {
        var useAlt = false;
        switch (itemType) {
            case ItemType.MUSHROOM:
            case ItemType.MUSHROOM_TRIPLE:
            case ItemType.MUSHROOM_GOLDEN:
                useAlt = (ch === '#' || ch === '|');
                break;
            case ItemType.BLUE_SHELL:
                useAlt = (ch === '<' || ch === '>' || ch === '~');
                break;
            case ItemType.LIGHTNING:
                useAlt = (Math.floor(Date.now() / 150) % 2 === 0);
                break;
            case ItemType.STAR:
                var starColors = [YELLOW, LIGHTRED, LIGHTGREEN, LIGHTCYAN, LIGHTMAGENTA, WHITE];
                var colorIdx = Math.floor(Date.now() / 100) % starColors.length;
                return makeAttr(starColors[colorIdx], BG_BLACK);
            case ItemType.BULLET:
                useAlt = (ch !== '=' && ch !== '>');
                break;
        }
        if (useAlt && icon.altColor) {
            return makeAttr(icon.altColor.fg, icon.altColor.bg);
        }
        return makeAttr(icon.color.fg, icon.color.bg);
    };
    HudRenderer.prototype.padLeft = function (str, len) {
        while (str.length < len) {
            str = ' ' + str;
        }
        return str;
    };
    HudRenderer.prototype.renderCountdown = function (countdown) {
        var countNum = Math.ceil(countdown);
        var centerX = 40;
        var topY = 8;
        var frameAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
        var poleAttr = colorToAttr({ fg: BROWN, bg: BG_BLACK });
        var redOn = countNum >= 3;
        var yellowOn = countNum === 2;
        var greenOn = countNum <= 1;
        var redAttr = redOn ? colorToAttr({ fg: LIGHTRED, bg: BG_RED }) : colorToAttr({ fg: RED, bg: BG_BLACK });
        var yellowAttr = yellowOn ? colorToAttr({ fg: YELLOW, bg: BG_BROWN }) : colorToAttr({ fg: BROWN, bg: BG_BLACK });
        var greenAttr = greenOn ? colorToAttr({ fg: LIGHTGREEN, bg: BG_GREEN }) : colorToAttr({ fg: GREEN, bg: BG_BLACK });
        var boxX = centerX - 3;
        this.composer.setCell(boxX, topY, GLYPH.DBOX_TL, frameAttr);
        for (var i = 1; i < 6; i++) {
            this.composer.setCell(boxX + i, topY, GLYPH.DBOX_H, frameAttr);
        }
        this.composer.setCell(boxX + 6, topY, GLYPH.DBOX_TR, frameAttr);
        this.composer.setCell(boxX, topY + 1, GLYPH.DBOX_V, frameAttr);
        this.composer.writeString(boxX + 1, topY + 1, " ", frameAttr);
        this.composer.setCell(boxX + 2, topY + 1, GLYPH.FULL_BLOCK, redAttr);
        this.composer.setCell(boxX + 3, topY + 1, GLYPH.FULL_BLOCK, redAttr);
        this.composer.setCell(boxX + 4, topY + 1, GLYPH.FULL_BLOCK, redAttr);
        this.composer.writeString(boxX + 5, topY + 1, " ", frameAttr);
        this.composer.setCell(boxX + 6, topY + 1, GLYPH.DBOX_V, frameAttr);
        this.composer.setCell(boxX, topY + 2, GLYPH.DBOX_V, frameAttr);
        this.composer.writeString(boxX + 1, topY + 2, "     ", frameAttr);
        this.composer.setCell(boxX + 6, topY + 2, GLYPH.DBOX_V, frameAttr);
        this.composer.setCell(boxX, topY + 3, GLYPH.DBOX_V, frameAttr);
        this.composer.writeString(boxX + 1, topY + 3, " ", frameAttr);
        this.composer.setCell(boxX + 2, topY + 3, GLYPH.FULL_BLOCK, yellowAttr);
        this.composer.setCell(boxX + 3, topY + 3, GLYPH.FULL_BLOCK, yellowAttr);
        this.composer.setCell(boxX + 4, topY + 3, GLYPH.FULL_BLOCK, yellowAttr);
        this.composer.writeString(boxX + 5, topY + 3, " ", frameAttr);
        this.composer.setCell(boxX + 6, topY + 3, GLYPH.DBOX_V, frameAttr);
        this.composer.setCell(boxX, topY + 4, GLYPH.DBOX_V, frameAttr);
        this.composer.writeString(boxX + 1, topY + 4, "     ", frameAttr);
        this.composer.setCell(boxX + 6, topY + 4, GLYPH.DBOX_V, frameAttr);
        this.composer.setCell(boxX, topY + 5, GLYPH.DBOX_V, frameAttr);
        this.composer.writeString(boxX + 1, topY + 5, " ", frameAttr);
        this.composer.setCell(boxX + 2, topY + 5, GLYPH.FULL_BLOCK, greenAttr);
        this.composer.setCell(boxX + 3, topY + 5, GLYPH.FULL_BLOCK, greenAttr);
        this.composer.setCell(boxX + 4, topY + 5, GLYPH.FULL_BLOCK, greenAttr);
        this.composer.writeString(boxX + 5, topY + 5, " ", frameAttr);
        this.composer.setCell(boxX + 6, topY + 5, GLYPH.DBOX_V, frameAttr);
        this.composer.setCell(boxX, topY + 6, GLYPH.DBOX_BL, frameAttr);
        for (var j = 1; j < 6; j++) {
            this.composer.setCell(boxX + j, topY + 6, GLYPH.DBOX_H, frameAttr);
        }
        this.composer.setCell(boxX + 6, topY + 6, GLYPH.DBOX_BR, frameAttr);
        this.composer.setCell(centerX, topY + 7, GLYPH.DBOX_V, poleAttr);
        this.composer.setCell(centerX, topY + 8, GLYPH.DBOX_V, poleAttr);
        if (greenOn && countNum <= 0) {
            var goAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
            this.composer.writeString(centerX - 2, topY + 9, "GO!!!", goAttr);
        }
    };
    return HudRenderer;
}());
