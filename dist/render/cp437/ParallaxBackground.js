"use strict";
var ParallaxBackground = (function () {
    function ParallaxBackground(visibleWidth, horizonY) {
        this.MOUNTAIN_PARALLAX = 0.3;
        this.width = visibleWidth;
        this.height = horizonY;
        this.bufferWidth = visibleWidth * 3;
        this.scrollOffset = this.width;
        this.skyBuffer = [];
        this.mountainBuffer = [];
        this.renderBackgroundLayers();
    }
    ParallaxBackground.prototype.renderBackgroundLayers = function () {
        this.skyBuffer = [];
        this.mountainBuffer = [];
        for (var y = 0; y < this.height; y++) {
            var skyRow = [];
            var mtRow = [];
            for (var x = 0; x < this.bufferWidth; x++) {
                skyRow.push({ char: ' ', attr: makeAttr(BLACK, BG_BLACK) });
                mtRow.push({ char: ' ', attr: makeAttr(BLACK, BG_BLACK) });
            }
            this.skyBuffer.push(skyRow);
            this.mountainBuffer.push(mtRow);
        }
        this.renderSunToBuffer();
        this.renderMountainsToBuffer();
    };
    ParallaxBackground.prototype.renderSunToBuffer = function () {
        var sunCoreAttr = makeAttr(YELLOW, BG_RED);
        var sunGlowAttr = makeAttr(LIGHTRED, BG_BLACK);
        var sunCenterX = Math.floor(this.bufferWidth / 2);
        var sunY = this.height - 5;
        for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -2; dx <= 2; dx++) {
                var y = sunY + dy;
                var x = sunCenterX + dx;
                if (y >= 0 && y < this.height && x >= 0 && x < this.bufferWidth) {
                    this.skyBuffer[y][x] = { char: GLYPH.FULL_BLOCK, attr: sunCoreAttr };
                }
            }
        }
        var glowOffsets = [
            { dx: -3, dy: -1 }, { dx: -3, dy: 0 }, { dx: -3, dy: 1 },
            { dx: 3, dy: -1 }, { dx: 3, dy: 0 }, { dx: 3, dy: 1 },
            { dx: -2, dy: -2 }, { dx: -1, dy: -2 }, { dx: 0, dy: -2 }, { dx: 1, dy: -2 }, { dx: 2, dy: -2 },
            { dx: -2, dy: 2 }, { dx: -1, dy: 2 }, { dx: 0, dy: 2 }, { dx: 1, dy: 2 }, { dx: 2, dy: 2 }
        ];
        for (var i = 0; i < glowOffsets.length; i++) {
            var g = glowOffsets[i];
            var y = sunY + g.dy;
            var x = sunCenterX + g.dx;
            if (y >= 0 && y < this.height && x >= 0 && x < this.bufferWidth) {
                this.skyBuffer[y][x] = { char: GLYPH.DARK_SHADE, attr: sunGlowAttr };
            }
        }
    };
    ParallaxBackground.prototype.renderMountainsToBuffer = function () {
        var mountainAttr = colorToAttr(PALETTE.MOUNTAIN);
        var highlightAttr = colorToAttr(PALETTE.MOUNTAIN_HIGHLIGHT);
        var mountainPattern = [
            { xOffset: 0, height: 4, width: 12 },
            { xOffset: 15, height: 6, width: 16 },
            { xOffset: 35, height: 3, width: 10 },
            { xOffset: 50, height: 5, width: 14 },
            { xOffset: 68, height: 4, width: 11 }
        ];
        var patternWidth = 80;
        var mountainBaseY = this.height - 1;
        for (var tileX = 0; tileX < this.bufferWidth; tileX += patternWidth) {
            for (var m = 0; m < mountainPattern.length; m++) {
                var mt = mountainPattern[m];
                var baseX = tileX + mt.xOffset;
                this.drawMountainToBuffer(baseX, mountainBaseY, mt.height, mt.width, mountainAttr, highlightAttr);
            }
        }
    };
    ParallaxBackground.prototype.drawMountainToBuffer = function (baseX, baseY, height, width, attr, highlightAttr) {
        var peakX = baseX + Math.floor(width / 2);
        for (var h = 0; h < height; h++) {
            var y = baseY - h;
            if (y < 0 || y >= this.height)
                continue;
            var halfWidth = Math.floor((height - h) * width / height / 2);
            for (var dx = -halfWidth; dx < 0; dx++) {
                var x = peakX + dx;
                if (x >= 0 && x < this.bufferWidth) {
                    this.mountainBuffer[y][x] = { char: '/', attr: attr };
                }
            }
            if (peakX >= 0 && peakX < this.bufferWidth) {
                if (h === height - 1) {
                    this.mountainBuffer[y][peakX] = { char: GLYPH.TRIANGLE_UP, attr: highlightAttr };
                }
                else {
                    this.mountainBuffer[y][peakX] = { char: GLYPH.BOX_V, attr: attr };
                }
            }
            for (var dx = 1; dx <= halfWidth; dx++) {
                var x = peakX + dx;
                if (x >= 0 && x < this.bufferWidth) {
                    this.mountainBuffer[y][x] = { char: '\\', attr: attr };
                }
            }
        }
    };
    ParallaxBackground.prototype.updateScroll = function (curvature, playerSteer, speed, dt) {
        var scrollSpeed = (curvature * 0.8 + playerSteer * 0.2) * speed * dt * 0.1;
        this.scrollOffset += scrollSpeed;
        if (this.scrollOffset < 0) {
            this.scrollOffset += this.bufferWidth;
        }
        else if (this.scrollOffset >= this.bufferWidth) {
            this.scrollOffset -= this.bufferWidth;
        }
    };
    ParallaxBackground.prototype.render = function (composer) {
        var mountainScroll = Math.floor(this.scrollOffset * this.MOUNTAIN_PARALLAX) % this.bufferWidth;
        var skyScroll = Math.floor(this.scrollOffset * 0.1) % this.bufferWidth;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var srcX = (x + skyScroll) % this.bufferWidth;
                var cell = this.skyBuffer[y][srcX];
                if (cell.char !== ' ') {
                    composer.setCell(x, y, cell.char, cell.attr);
                }
            }
        }
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var srcX = (x + mountainScroll) % this.bufferWidth;
                var cell = this.mountainBuffer[y][srcX];
                if (cell.char !== ' ') {
                    composer.setCell(x, y, cell.char, cell.attr);
                }
            }
        }
    };
    ParallaxBackground.prototype.getScrollOffset = function () {
        return this.scrollOffset;
    };
    ParallaxBackground.prototype.resetScroll = function () {
        this.scrollOffset = this.width;
    };
    return ParallaxBackground;
}());
