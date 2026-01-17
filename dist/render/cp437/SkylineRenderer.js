"use strict";
var SkylineRenderer = (function () {
    function SkylineRenderer(composer, horizonY) {
        this.composer = composer;
        this.horizonY = horizonY;
        this.parallax = new ParallaxBackground(80, horizonY);
        this.parallax.resetScroll();
    }
    SkylineRenderer.prototype.render = function (trackPosition, curvature, playerSteer, speed, dt) {
        this.renderSkyBackground();
        if (curvature !== undefined && speed !== undefined && dt !== undefined) {
            this.parallax.updateScroll(curvature, playerSteer || 0, speed, dt);
        }
        this.parallax.render(this.composer);
        this.renderSkyGrid(trackPosition);
    };
    SkylineRenderer.prototype.renderSkyBackground = function () {
        var bgAttr = makeAttr(BLACK, BG_BLACK);
        for (var y = 0; y < this.horizonY; y++) {
            for (var x = 0; x < 80; x++) {
                this.composer.setCell(x, y, ' ', bgAttr);
            }
        }
    };
    SkylineRenderer.prototype.renderSkyGrid = function (trackPosition) {
        var gridAttr = colorToAttr(PALETTE.SKY_GRID);
        var glowAttr = colorToAttr(PALETTE.SKY_GRID_GLOW);
        var vanishX = 40;
        for (var y = this.horizonY - 1; y >= 2; y--) {
            var distFromHorizon = this.horizonY - y;
            var spread = distFromHorizon * 6;
            for (var offset = 0; offset <= spread && offset < 40; offset += 10) {
                var leftX = vanishX - offset;
                var rightX = vanishX + offset;
                if (offset === 0) {
                    this.safePutCell(vanishX, y, GLYPH.BOX_V, gridAttr);
                }
                else {
                    if (leftX >= 0 && leftX < 80) {
                        this.safePutCell(leftX, y, '/', glowAttr);
                    }
                    if (rightX >= 0 && rightX < 80) {
                        this.safePutCell(rightX, y, '\\', glowAttr);
                    }
                }
            }
            var linePhase = Math.floor(trackPosition / 50 + distFromHorizon) % 4;
            if (linePhase === 0) {
                var lineSpread = Math.min(spread, 38);
                for (var x = vanishX - lineSpread; x <= vanishX + lineSpread; x++) {
                    if (x >= 0 && x < 80) {
                        this.safePutCell(x, y, GLYPH.BOX_H, glowAttr);
                    }
                }
            }
        }
    };
    SkylineRenderer.prototype.safePutCell = function (x, y, char, attr) {
        if (x < 0 || x >= 80 || y < 0 || y >= 24)
            return;
        var buffer = this.composer.getBuffer();
        if (!buffer[y] || !buffer[y][x])
            return;
        var cell = buffer[y][x];
        if (cell.char === ' ') {
            this.composer.setCell(x, y, char, attr);
        }
    };
    return SkylineRenderer;
}());
