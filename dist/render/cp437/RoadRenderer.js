"use strict";
var RoadRenderer = (function () {
    function RoadRenderer(composer, horizonY) {
        this.composer = composer;
        this.horizonY = horizonY;
        this.roadBottom = 23;
    }
    RoadRenderer.prototype.render = function (trackPosition, cameraX, track, road) {
        var roadLength = road ? road.totalLength : 55000;
        for (var screenY = this.roadBottom; screenY > this.horizonY; screenY--) {
            var t = (this.roadBottom - screenY) / (this.roadBottom - this.horizonY);
            var distance = 1 / (1 - t * 0.95);
            var roadWidth = Math.round(40 / distance);
            var halfWidth = Math.floor(roadWidth / 2);
            var curveOffset = 0;
            if (track && typeof track.getCenterlineX === 'function') {
                curveOffset = Math.round(track.getCenterlineX(trackPosition + distance * 10) * 0.1);
            }
            var centerX = 40 + curveOffset - Math.round(cameraX * 0.5);
            this.renderScanline(screenY, centerX, halfWidth, distance, trackPosition, roadLength);
        }
    };
    RoadRenderer.prototype.renderScanline = function (y, centerX, halfWidth, distance, trackZ, roadLength) {
        var width = 80;
        var leftEdge = centerX - halfWidth;
        var rightEdge = centerX + halfWidth;
        var stripePhase = Math.floor((trackZ + distance * 5) / 15) % 2;
        var roadAttr = colorToAttr(distance < 10 ? PALETTE.ROAD_LIGHT : PALETTE.ROAD_DARK);
        var gridAttr = colorToAttr(PALETTE.ROAD_GRID);
        var worldZ = trackZ + distance * 5;
        var wrappedZ = worldZ % roadLength;
        if (wrappedZ < 0)
            wrappedZ += roadLength;
        var isFinishLine = (wrappedZ < 200) || (wrappedZ > roadLength - 200);
        for (var x = 0; x < width; x++) {
            if (x >= leftEdge && x <= rightEdge) {
                if (isFinishLine) {
                    this.renderFinishLineCell(x, y, centerX, leftEdge, rightEdge, distance);
                }
                else {
                    this.renderRoadCell(x, y, centerX, leftEdge, rightEdge, stripePhase, distance, roadAttr, gridAttr);
                }
            }
            else {
                this.renderOffroadCell(x, y, leftEdge, rightEdge, distance, trackZ);
            }
        }
    };
    RoadRenderer.prototype.renderFinishLineCell = function (x, y, centerX, leftEdge, rightEdge, distance) {
        if (x === leftEdge || x === rightEdge) {
            this.composer.setCell(x, y, GLYPH.BOX_V, colorToAttr({ fg: WHITE, bg: BG_BLACK }));
            return;
        }
        var checkerSize = Math.max(1, Math.floor(3 / distance));
        var checkerX = Math.floor((x - centerX) / checkerSize);
        var checkerY = Math.floor(y / 2);
        var isWhite = ((checkerX + checkerY) % 2) === 0;
        if (isWhite) {
            this.composer.setCell(x, y, GLYPH.FULL_BLOCK, colorToAttr({ fg: WHITE, bg: BG_LIGHTGRAY }));
        }
        else {
            this.composer.setCell(x, y, ' ', colorToAttr({ fg: BLACK, bg: BG_BLACK }));
        }
    };
    RoadRenderer.prototype.renderRoadCell = function (x, y, centerX, leftEdge, rightEdge, stripePhase, distance, roadAttr, gridAttr) {
        if (x === leftEdge || x === rightEdge) {
            this.composer.setCell(x, y, GLYPH.BOX_V, colorToAttr(PALETTE.ROAD_EDGE));
            return;
        }
        if (Math.abs(x - centerX) < 1 && stripePhase === 0) {
            this.composer.setCell(x, y, GLYPH.BOX_V, colorToAttr(PALETTE.ROAD_STRIPE));
            return;
        }
        var gridPhase = Math.floor(distance) % 3;
        if (gridPhase === 0 && distance > 5) {
            this.composer.setCell(x, y, GLYPH.BOX_H, gridAttr);
        }
        else {
            var shade = this.getShadeForDistance(distance);
            this.composer.setCell(x, y, shade, roadAttr);
        }
    };
    RoadRenderer.prototype.renderOffroadCell = function (x, y, leftEdge, rightEdge, distance, trackZ) {
        var bgAttr = makeAttr(BLACK, BG_BLACK);
        this.composer.setCell(x, y, ' ', bgAttr);
        var side = x < leftEdge ? 'left' : 'right';
        var distFromRoad = side === 'left' ? leftEdge - x : x - rightEdge;
        var scale = Math.min(1, 3 / distance);
        var gridSize = 8;
        var worldZ = Math.floor(trackZ + distance * 10);
        var gridZ = Math.floor(worldZ / gridSize);
        var anchorX = (side === 'left') ? leftEdge - 8 : rightEdge + 8;
        var seed = gridZ * 1000 + (side === 'left' ? 1 : 2);
        var rand = this.pseudoRandom(seed);
        var shouldDraw = (Math.abs(x - anchorX) < 2) &&
            (rand < 0.7) &&
            (distFromRoad > 3 && distFromRoad < 20);
        if (shouldDraw && x === anchorX) {
            this.drawSceneryObject(x, y, distance, scale, rand);
        }
        else if (distFromRoad <= 2) {
            this.composer.setCell(x, y, GLYPH.GRASS, colorToAttr(PALETTE.OFFROAD_DIRT));
        }
    };
    RoadRenderer.prototype.drawSceneryObject = function (x, y, distance, scale, rand) {
        if (rand < 0.05) {
            this.drawTree(x, y, distance, scale);
        }
        else if (rand < 0.10) {
            this.drawRock(x, y, distance, scale);
        }
        else {
            this.drawBush(x, y, distance, scale);
        }
    };
    RoadRenderer.prototype.drawTree = function (x, y, distance, _scale) {
        var leafTrunkAttr = makeAttr(LIGHTGREEN, BG_BROWN);
        var leafAttr = makeAttr(LIGHTGREEN, BG_BLACK);
        var leafDarkAttr = makeAttr(GREEN, BG_BLACK);
        var trunkAttr = makeAttr(BROWN, BG_BLACK);
        if (distance > 8) {
            this.safePut(x, y, GLYPH.UPPER_HALF, leafTrunkAttr);
        }
        else if (distance > 5) {
            this.safePut(x - 1, y - 1, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x, y - 1, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 1, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x, y, GLYPH.UPPER_HALF, leafTrunkAttr);
        }
        else if (distance > 3) {
            this.safePut(x - 1, y - 2, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 2, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x - 1, y - 1, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x, y - 1, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 1, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 1, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x, y, GLYPH.UPPER_HALF, leafTrunkAttr);
            this.safePut(x + 1, y, GLYPH.UPPER_HALF, leafTrunkAttr);
        }
        else if (distance > 1.5) {
            this.safePut(x - 2, y - 3, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x - 1, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 3, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x - 2, y - 2, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x - 1, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 2, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x - 1, y - 1, GLYPH.LOWER_HALF, leafDarkAttr);
            this.safePut(x, y - 1, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 1, GLYPH.LOWER_HALF, leafDarkAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, trunkAttr);
            this.safePut(x, y + 1, GLYPH.UPPER_HALF, trunkAttr);
        }
        else {
            this.safePut(x - 2, y - 4, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x - 1, y - 4, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x, y - 4, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 4, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 4, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 3, y - 4, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x - 2, y - 3, GLYPH.FULL_BLOCK, leafDarkAttr);
            this.safePut(x - 1, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 3, y - 3, GLYPH.FULL_BLOCK, leafDarkAttr);
            this.safePut(x - 1, y - 2, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 2, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x, y - 1, GLYPH.LOWER_HALF, leafDarkAttr);
            this.safePut(x + 1, y - 1, GLYPH.LOWER_HALF, leafDarkAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, trunkAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, trunkAttr);
            this.safePut(x, y + 1, GLYPH.UPPER_HALF, trunkAttr);
            this.safePut(x + 1, y + 1, GLYPH.UPPER_HALF, trunkAttr);
        }
    };
    RoadRenderer.prototype.drawRock = function (x, y, distance, _scale) {
        var rockAttr = makeAttr(DARKGRAY, BG_BLACK);
        var rockLightAttr = makeAttr(LIGHTGRAY, BG_BLACK);
        if (distance > 8) {
            this.safePut(x, y, GLYPH.LOWER_HALF, rockAttr);
        }
        else if (distance > 5) {
            this.safePut(x - 1, y, GLYPH.LOWER_HALF, rockAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, rockLightAttr);
            this.safePut(x + 1, y, GLYPH.LOWER_HALF, rockAttr);
        }
        else if (distance > 3) {
            this.safePut(x - 1, y, GLYPH.LOWER_HALF, rockAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, rockLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, rockAttr);
            this.safePut(x + 2, y, GLYPH.LOWER_HALF, rockAttr);
        }
        else if (distance > 1.5) {
            this.safePut(x - 2, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x - 1, y - 1, GLYPH.UPPER_HALF, rockLightAttr);
            this.safePut(x, y - 1, GLYPH.UPPER_HALF, rockLightAttr);
            this.safePut(x + 1, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x + 2, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x - 2, y, GLYPH.LOWER_HALF, rockAttr);
            this.safePut(x - 1, y, GLYPH.FULL_BLOCK, rockAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, rockLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, rockAttr);
            this.safePut(x + 2, y, GLYPH.LOWER_HALF, rockAttr);
        }
        else {
            this.safePut(x - 2, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x - 1, y - 1, GLYPH.UPPER_HALF, rockLightAttr);
            this.safePut(x, y - 1, GLYPH.UPPER_HALF, rockLightAttr);
            this.safePut(x + 1, y - 1, GLYPH.UPPER_HALF, rockLightAttr);
            this.safePut(x + 2, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x + 3, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x - 2, y, GLYPH.LOWER_HALF, rockAttr);
            this.safePut(x - 1, y, GLYPH.FULL_BLOCK, rockAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, rockLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, rockLightAttr);
            this.safePut(x + 2, y, GLYPH.FULL_BLOCK, rockAttr);
            this.safePut(x + 3, y, GLYPH.LOWER_HALF, rockAttr);
        }
    };
    RoadRenderer.prototype.drawBush = function (x, y, distance, _scale) {
        var bushAttr = makeAttr(GREEN, BG_BLACK);
        var bushLightAttr = makeAttr(LIGHTGREEN, BG_BLACK);
        if (distance > 8) {
            this.safePut(x, y, GLYPH.LOWER_HALF, bushAttr);
        }
        else if (distance > 5) {
            this.safePut(x - 1, y, GLYPH.LOWER_HALF, bushAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 1, y, GLYPH.LOWER_HALF, bushAttr);
        }
        else if (distance > 3) {
            this.safePut(x - 1, y, GLYPH.LOWER_HALF, bushAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, bushAttr);
            this.safePut(x + 2, y, GLYPH.LOWER_HALF, bushAttr);
        }
        else if (distance > 1.5) {
            this.safePut(x - 1, y - 1, GLYPH.UPPER_HALF, bushAttr);
            this.safePut(x, y - 1, GLYPH.UPPER_HALF, bushLightAttr);
            this.safePut(x + 1, y - 1, GLYPH.UPPER_HALF, bushLightAttr);
            this.safePut(x + 2, y - 1, GLYPH.UPPER_HALF, bushAttr);
            this.safePut(x - 2, y, GLYPH.LOWER_HALF, bushAttr);
            this.safePut(x - 1, y, GLYPH.FULL_BLOCK, bushAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 2, y, GLYPH.FULL_BLOCK, bushAttr);
            this.safePut(x + 3, y, GLYPH.LOWER_HALF, bushAttr);
        }
        else {
            this.safePut(x - 2, y - 1, GLYPH.UPPER_HALF, bushAttr);
            this.safePut(x - 1, y - 1, GLYPH.UPPER_HALF, bushLightAttr);
            this.safePut(x, y - 1, GLYPH.UPPER_HALF, bushLightAttr);
            this.safePut(x + 1, y - 1, GLYPH.UPPER_HALF, bushLightAttr);
            this.safePut(x + 2, y - 1, GLYPH.UPPER_HALF, bushAttr);
            this.safePut(x + 3, y - 1, GLYPH.UPPER_HALF, bushAttr);
            this.safePut(x - 2, y, GLYPH.LOWER_HALF, bushAttr);
            this.safePut(x - 1, y, GLYPH.FULL_BLOCK, bushAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 2, y, GLYPH.FULL_BLOCK, bushAttr);
            this.safePut(x + 3, y, GLYPH.LOWER_HALF, bushAttr);
        }
    };
    RoadRenderer.prototype.safePut = function (x, y, char, attr) {
        if (x >= 0 && x < 80 && y >= this.horizonY && y <= this.roadBottom) {
            this.composer.setCell(x, y, char, attr);
        }
    };
    RoadRenderer.prototype.pseudoRandom = function (seed) {
        var x = Math.sin(seed * 12.9898) * 43758.5453;
        return x - Math.floor(x);
    };
    RoadRenderer.prototype.getShadeForDistance = function (distance) {
        if (distance < 5)
            return GLYPH.FULL_BLOCK;
        if (distance < 15)
            return GLYPH.DARK_SHADE;
        if (distance < 30)
            return GLYPH.MEDIUM_SHADE;
        return GLYPH.LIGHT_SHADE;
    };
    return RoadRenderer;
}());
