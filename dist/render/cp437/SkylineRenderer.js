"use strict";
var SkylineRenderer = (function () {
    function SkylineRenderer(composer, horizonY) {
        this.composer = composer;
        this.horizonY = horizonY;
        this.parallax = new ParallaxBackground(80, horizonY);
        this.parallax.resetScroll();
        this.gridAnimPhase = 0;
    }
    SkylineRenderer.prototype.render = function (_trackPosition, curvature, playerSteer, speed, dt) {
        this.renderSkyBackground();
        if (curvature !== undefined && speed !== undefined && dt !== undefined && speed > 0) {
            this.parallax.updateScroll(curvature, playerSteer || 0, speed, dt);
        }
        if (speed !== undefined && dt !== undefined && speed > 0) {
            this.gridAnimPhase += speed * dt * 0.003;
            while (this.gridAnimPhase >= 1)
                this.gridAnimPhase -= 1;
            while (this.gridAnimPhase < 0)
                this.gridAnimPhase += 1;
        }
        this.renderSkyGrid();
        this.parallax.render(this.composer);
    };
    SkylineRenderer.prototype.renderSkyBackground = function () {
        var bgAttr = makeAttr(BLACK, BG_BLACK);
        for (var y = 0; y < this.horizonY; y++) {
            for (var x = 0; x < 80; x++) {
                this.composer.setCell(x, y, ' ', bgAttr);
            }
        }
    };
    SkylineRenderer.prototype.renderSkyGrid = function () {
        var gridAttr = colorToAttr(PALETTE.SKY_GRID);
        var glowAttr = colorToAttr(PALETTE.SKY_GRID_GLOW);
        var vanishX = 40;
        var screenWidth = 80;
        for (var y = this.horizonY - 1; y >= 1; y--) {
            var distFromHorizon = this.horizonY - y;
            var spread = distFromHorizon * 6;
            for (var offset = 0; offset <= 40; offset += 8) {
                if (offset <= spread) {
                    var leftX = vanishX - offset;
                    var rightX = vanishX + offset;
                    if (offset === 0) {
                        this.composer.setCell(vanishX, y, GLYPH.BOX_V, gridAttr);
                    }
                    else {
                        if (leftX >= 0 && leftX < screenWidth) {
                            this.composer.setCell(leftX, y, '/', glowAttr);
                        }
                        if (rightX >= 0 && rightX < screenWidth) {
                            this.composer.setCell(rightX, y, '\\', glowAttr);
                        }
                    }
                }
            }
            var lineSpacing = 3;
            var scanlinePhase = (this.gridAnimPhase * lineSpacing + (this.horizonY - y) * 0.3) % 1;
            if (scanlinePhase < 0.33) {
                var lineSpread = Math.min(spread, 39);
                for (var x = vanishX - lineSpread; x <= vanishX + lineSpread; x++) {
                    if (x >= 0 && x < screenWidth) {
                        var buffer = this.composer.getBuffer();
                        var cell = buffer[y][x];
                        if (cell.char === ' ') {
                            this.composer.setCell(x, y, GLYPH.BOX_H, glowAttr);
                        }
                    }
                }
            }
        }
    };
    return SkylineRenderer;
}());
