"use strict";
var FrameRenderer = (function () {
    function FrameRenderer(width, height) {
        this.width = width;
        this.height = height;
        this.horizonY = 8;
        this._mountainScrollOffset = 0;
        this.frameManager = new FrameManager(width, height, this.horizonY);
        this.treeSprite = null;
        this.rockSprite = null;
        this.bushSprite = null;
        this.playerCarSprite = null;
    }
    FrameRenderer.prototype.init = function () {
        load('frame.js');
        this.frameManager.init();
        this.treeSprite = SpriteSheet.createTree();
        this.rockSprite = SpriteSheet.createRock();
        this.bushSprite = SpriteSheet.createBush();
        this.playerCarSprite = SpriteSheet.createPlayerCar();
        this.renderSun();
        this.renderMountains();
        logInfo('FrameRenderer initialized with layered Frame.js architecture');
    };
    FrameRenderer.prototype.beginFrame = function () {
    };
    FrameRenderer.prototype.renderSky = function (trackPosition, curvature, playerSteer, speed, dt) {
        this.renderSkyGrid(trackPosition);
        if (curvature !== undefined && playerSteer !== undefined && speed !== undefined && dt !== undefined) {
            this.updateParallax(curvature, playerSteer, speed, dt);
        }
    };
    FrameRenderer.prototype.renderRoad = function (trackPosition, cameraX, _track, road) {
        this.renderRoadSurface(trackPosition, cameraX, road);
        var roadsideObjects = this.buildRoadsideObjects(trackPosition, cameraX, road);
        this.renderRoadsideSprites(roadsideObjects);
    };
    FrameRenderer.prototype.buildRoadsideObjects = function (trackPosition, cameraX, road) {
        var objects = [];
        var roadHeight = this.height - this.horizonY;
        var viewDistanceWorld = 100;
        var startZ = trackPosition;
        var endZ = trackPosition + viewDistanceWorld;
        var objectSpacing = 10;
        var firstObjectZ = Math.ceil(startZ / objectSpacing) * objectSpacing;
        for (var worldZ = firstObjectZ; worldZ < endZ; worldZ += objectSpacing) {
            var worldZInt = Math.floor(worldZ);
            var typeIndex = worldZInt % 3;
            var hasTree = (typeIndex === 0);
            var hasRock = (typeIndex === 1);
            var hasBush = (typeIndex === 2);
            var relativeZ = worldZ - trackPosition;
            if (relativeZ <= 0)
                continue;
            var distance = relativeZ / 5;
            if (distance < 1 || distance > 20)
                continue;
            var t = 1 - (1 / distance);
            var screenY = Math.round(this.horizonY + roadHeight * (1 - t));
            if (screenY <= this.horizonY || screenY >= this.height)
                continue;
            var accumulatedCurve = 0;
            for (var z = trackPosition; z < worldZ; z += 5) {
                var seg = road.getSegment(z);
                if (seg)
                    accumulatedCurve += seg.curve * 0.5;
            }
            var curveOffset = accumulatedCurve * distance * 0.8;
            var centerX = 40 + Math.round(curveOffset) - Math.round(cameraX * 0.5);
            var roadHalfWidth = Math.round(20 / distance);
            var leftEdge = centerX - roadHalfWidth;
            var rightEdge = centerX + roadHalfWidth;
            var edgeOffset = Math.round(15 / distance) + 3;
            var leftX = leftEdge - edgeOffset;
            var rightX = rightEdge + edgeOffset;
            if (hasTree) {
                if (leftX >= 0) {
                    objects.push({ x: leftX, y: screenY, distance: distance, type: 'tree' });
                }
                if (rightX < 80) {
                    objects.push({ x: rightX, y: screenY, distance: distance, type: 'tree' });
                }
            }
            if (hasRock) {
                var rockSide = (Math.floor(worldZ / 50) % 2 === 0) ? -1 : 1;
                var rockX = (rockSide < 0) ? leftX - 2 : rightX + 2;
                if (rockX >= 0 && rockX < 80) {
                    objects.push({ x: rockX, y: screenY, distance: distance, type: 'rock' });
                }
            }
            if (hasBush) {
                var bushSide = (Math.floor(worldZ / 20) % 2 === 0) ? -1 : 1;
                var bushX = (bushSide < 0) ? leftX + 2 : rightX - 2;
                if (bushX >= 0 && bushX < 80) {
                    objects.push({ x: bushX, y: screenY, distance: distance, type: 'bush' });
                }
            }
        }
        objects.sort(function (a, b) { return b.distance - a.distance; });
        return objects;
    };
    FrameRenderer.prototype.renderEntities = function (playerVehicle, _vehicles, _items) {
        this.renderPlayerVehicle(playerVehicle.playerX, playerVehicle.flashTimer > 0);
    };
    FrameRenderer.prototype.endFrame = function () {
        this.cycle();
    };
    FrameRenderer.prototype.renderSun = function () {
        var sunFrame = this.frameManager.getSunFrame();
        if (!sunFrame)
            return;
        var sunCoreAttr = makeAttr(YELLOW, BG_RED);
        var sunGlowAttr = makeAttr(LIGHTRED, BG_BLACK);
        var sunX = Math.floor(this.width / 2) - 3;
        var sunY = this.horizonY - 5;
        for (var dy = 0; dy < 3; dy++) {
            for (var dx = 0; dx < 5; dx++) {
                sunFrame.setData(sunX + dx, sunY + dy, GLYPH.FULL_BLOCK, sunCoreAttr);
            }
        }
        var glowChar = GLYPH.DARK_SHADE;
        for (var x = sunX - 1; x <= sunX + 5; x++) {
            sunFrame.setData(x, sunY - 1, glowChar, sunGlowAttr);
        }
        for (var x = sunX - 1; x <= sunX + 5; x++) {
            sunFrame.setData(x, sunY + 3, glowChar, sunGlowAttr);
        }
        sunFrame.setData(sunX - 1, sunY, glowChar, sunGlowAttr);
        sunFrame.setData(sunX - 1, sunY + 1, glowChar, sunGlowAttr);
        sunFrame.setData(sunX - 1, sunY + 2, glowChar, sunGlowAttr);
        sunFrame.setData(sunX + 5, sunY, glowChar, sunGlowAttr);
        sunFrame.setData(sunX + 5, sunY + 1, glowChar, sunGlowAttr);
        sunFrame.setData(sunX + 5, sunY + 2, glowChar, sunGlowAttr);
    };
    FrameRenderer.prototype.renderMountains = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var mountainAttr = colorToAttr(PALETTE.MOUNTAIN);
        var highlightAttr = colorToAttr(PALETTE.MOUNTAIN_HIGHLIGHT);
        var mountains = [
            { x: 5, height: 4, width: 12 },
            { x: 20, height: 6, width: 16 },
            { x: 42, height: 5, width: 14 },
            { x: 60, height: 4, width: 10 },
            { x: 72, height: 3, width: 8 }
        ];
        for (var i = 0; i < mountains.length; i++) {
            this.drawMountainToFrame(frame, mountains[i].x, this.horizonY - 1, mountains[i].height, mountains[i].width, mountainAttr, highlightAttr);
        }
    };
    FrameRenderer.prototype.drawMountainToFrame = function (frame, baseX, baseY, height, width, attr, highlightAttr) {
        var peakX = baseX + Math.floor(width / 2);
        for (var h = 0; h < height; h++) {
            var y = baseY - h;
            if (y < 0)
                continue;
            var halfWidth = Math.floor((height - h) * width / height / 2);
            for (var dx = -halfWidth; dx <= halfWidth; dx++) {
                var x = peakX + dx;
                if (x >= 0 && x < this.width) {
                    if (dx < 0) {
                        frame.setData(x, y, '/', attr);
                    }
                    else if (dx > 0) {
                        frame.setData(x, y, '\\', attr);
                    }
                    else {
                        if (h === height - 1) {
                            frame.setData(x, y, GLYPH.TRIANGLE_UP, highlightAttr);
                        }
                        else {
                            frame.setData(x, y, GLYPH.BOX_V, attr);
                        }
                    }
                }
            }
        }
    };
    FrameRenderer.prototype.renderSkyGrid = function (trackPosition) {
        var frame = this.frameManager.getSkyGridFrame();
        if (!frame)
            return;
        frame.clear();
        var gridAttr = colorToAttr(PALETTE.SKY_GRID);
        var glowAttr = colorToAttr(PALETTE.SKY_GRID_GLOW);
        var vanishX = 40;
        for (var y = this.horizonY - 1; y >= 1; y--) {
            var distFromHorizon = this.horizonY - y;
            var spread = distFromHorizon * 6;
            for (var offset = 0; offset <= spread && offset < 40; offset += 10) {
                if (offset === 0) {
                    frame.setData(vanishX, y, GLYPH.BOX_V, gridAttr);
                }
                else {
                    var leftX = vanishX - offset;
                    var rightX = vanishX + offset;
                    if (leftX >= 0)
                        frame.setData(leftX, y, '/', glowAttr);
                    if (rightX < this.width)
                        frame.setData(rightX, y, '\\', glowAttr);
                }
            }
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
    };
    FrameRenderer.prototype.updateParallax = function (curvature, steer, speed, dt) {
        var scrollAmount = (curvature * 0.8 + steer * 0.2) * speed * dt * 0.1;
        this._mountainScrollOffset += scrollAmount * 0.3;
    };
    FrameRenderer.prototype.renderRoadSurface = function (trackPosition, cameraX, road) {
        var frame = this.frameManager.getRoadFrame();
        if (!frame)
            return;
        frame.clear();
        var roadBottom = this.height - this.horizonY - 1;
        var roadLength = road.totalLength;
        var accumulatedCurve = 0;
        for (var screenY = roadBottom; screenY >= 0; screenY--) {
            var t = (roadBottom - screenY) / roadBottom;
            var distance = 1 / (1 - t * 0.95);
            var worldZ = trackPosition + distance * 5;
            var segment = road.getSegment(worldZ);
            if (segment) {
                accumulatedCurve += segment.curve * 0.5;
            }
            var roadWidth = Math.round(40 / distance);
            var halfWidth = Math.floor(roadWidth / 2);
            var curveOffset = accumulatedCurve * distance * 0.8;
            var centerX = 40 + Math.round(curveOffset) - Math.round(cameraX * 0.5);
            var leftEdge = centerX - halfWidth;
            var rightEdge = centerX + halfWidth;
            var stripePhase = Math.floor((trackPosition + distance * 5) / 15) % 2;
            var wrappedZ = worldZ % roadLength;
            if (wrappedZ < 0)
                wrappedZ += roadLength;
            var isFinishLine = (wrappedZ < 200) || (wrappedZ > roadLength - 200);
            this.renderRoadScanline(frame, screenY, centerX, leftEdge, rightEdge, distance, stripePhase, isFinishLine);
        }
    };
    FrameRenderer.prototype.renderRoadScanline = function (frame, y, centerX, leftEdge, rightEdge, distance, stripePhase, isFinishLine) {
        var roadAttr = colorToAttr(distance < 10 ? PALETTE.ROAD_LIGHT : PALETTE.ROAD_DARK);
        var gridAttr = colorToAttr(PALETTE.ROAD_GRID);
        var edgeAttr = colorToAttr(PALETTE.ROAD_EDGE);
        var stripeAttr = colorToAttr(PALETTE.ROAD_STRIPE);
        var dirtAttr = colorToAttr(PALETTE.OFFROAD_DIRT);
        for (var x = 0; x < this.width; x++) {
            if (x >= leftEdge && x <= rightEdge) {
                if (isFinishLine) {
                    this.renderFinishCell(frame, x, y, centerX, leftEdge, rightEdge, distance);
                }
                else if (x === leftEdge || x === rightEdge) {
                    frame.setData(x, y, GLYPH.BOX_V, edgeAttr);
                }
                else if (Math.abs(x - centerX) < 1 && stripePhase === 0) {
                    frame.setData(x, y, GLYPH.BOX_V, stripeAttr);
                }
                else {
                    var gridPhase = Math.floor(distance) % 3;
                    if (gridPhase === 0 && distance > 5) {
                        frame.setData(x, y, GLYPH.BOX_H, gridAttr);
                    }
                    else {
                        frame.setData(x, y, ' ', roadAttr);
                    }
                }
            }
            else {
                var distFromRoad = (x < leftEdge) ? leftEdge - x : x - rightEdge;
                if (distFromRoad <= 2) {
                    frame.setData(x, y, GLYPH.GRASS, dirtAttr);
                }
            }
        }
    };
    FrameRenderer.prototype.renderFinishCell = function (frame, x, y, centerX, leftEdge, rightEdge, distance) {
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
        }
        else {
            frame.setData(x, y, ' ', makeAttr(BLACK, BG_BLACK));
        }
    };
    FrameRenderer.prototype.renderRoadsideSprites = function (objects) {
        objects.sort(function (a, b) { return b.distance - a.distance; });
        var poolSize = this.frameManager.getRoadsidePoolSize();
        var used = 0;
        for (var i = 0; i < objects.length && used < poolSize; i++) {
            var obj = objects[i];
            var spriteFrame = this.frameManager.getRoadsideFrame(used);
            if (!spriteFrame)
                continue;
            var sprite;
            if (obj.type === 'tree') {
                sprite = this.treeSprite;
            }
            else if (obj.type === 'rock') {
                sprite = this.rockSprite;
            }
            else {
                sprite = this.bushSprite;
            }
            var scaleIndex = this.getScaleForDistance(obj.distance);
            renderSpriteToFrame(spriteFrame, sprite, scaleIndex);
            var size = getSpriteSize(sprite, scaleIndex);
            var frameX = Math.round(obj.x - size.width / 2);
            var frameY = Math.round(obj.y - size.height + 1);
            this.frameManager.positionRoadsideFrame(used, frameX, frameY, true);
            used++;
        }
        for (var j = used; j < poolSize; j++) {
            this.frameManager.positionRoadsideFrame(j, 0, 0, false);
        }
    };
    FrameRenderer.prototype.getScaleForDistance = function (distance) {
        if (distance > 8)
            return 0;
        if (distance > 5)
            return 1;
        if (distance > 3)
            return 2;
        if (distance > 1.5)
            return 3;
        return 4;
    };
    FrameRenderer.prototype.renderPlayerVehicle = function (playerX, isFlashing) {
        var frame = this.frameManager.getVehicleFrame(0);
        if (!frame)
            return;
        renderSpriteToFrame(frame, this.playerCarSprite, 0);
        if (isFlashing) {
            var flashColor = (Math.floor(Date.now() / 100) % 2 === 0) ? WHITE : LIGHTRED;
            var flashAttr = makeAttr(flashColor, BG_BLACK);
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 5; x++) {
                    var cell = this.playerCarSprite.variants[0][y] ? this.playerCarSprite.variants[0][y][x] : null;
                    if (cell) {
                        frame.setData(x, y, cell.char, flashAttr);
                    }
                }
            }
        }
        var screenX = 40 + Math.round(playerX * 5) - 2;
        var screenY = this.height - 3;
        this.frameManager.positionVehicleFrame(0, screenX, screenY, true);
    };
    FrameRenderer.prototype.renderHud = function (hudData) {
        var frame = this.frameManager.getHudFrame();
        if (!frame)
            return;
        frame.clear();
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        var valueAttr = colorToAttr(PALETTE.HUD_VALUE);
        this.writeStringToFrame(frame, 2, 0, 'LAP', labelAttr);
        this.writeStringToFrame(frame, 6, 0, hudData.lap + '/' + hudData.totalLaps, valueAttr);
        this.writeStringToFrame(frame, 14, 0, 'POS', labelAttr);
        this.writeStringToFrame(frame, 18, 0, hudData.position + PositionIndicator.getOrdinalSuffix(hudData.position), valueAttr);
        this.writeStringToFrame(frame, 26, 0, 'TIME', labelAttr);
        this.writeStringToFrame(frame, 31, 0, LapTimer.format(hudData.lapTime), valueAttr);
        this.writeStringToFrame(frame, 66, 0, 'SPD', labelAttr);
        this.writeStringToFrame(frame, 70, 0, this.padLeft(hudData.speed.toString(), 3), valueAttr);
        this.renderSpeedometerBar(frame, hudData.speed, hudData.speedMax);
        this.renderTrackProgress(frame, hudData.lapProgress);
    };
    FrameRenderer.prototype.renderTrackProgress = function (frame, progress) {
        var y = this.height - 1;
        var barX = 60;
        var barWidth = 15;
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        var filledAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
        var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
        var finishAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
        this.writeStringToFrame(frame, barX - 5, y, 'TRK', labelAttr);
        frame.setData(barX, y, '[', labelAttr);
        var fillWidth = Math.round(progress * barWidth);
        for (var i = 0; i < barWidth; i++) {
            var attr = (i < fillWidth) ? filledAttr : emptyAttr;
            var char = (i < fillWidth) ? GLYPH.FULL_BLOCK : GLYPH.LIGHT_SHADE;
            frame.setData(barX + 1 + i, y, char, attr);
        }
        frame.setData(barX + barWidth + 1, y, ']', finishAttr);
    };
    FrameRenderer.prototype.renderSpeedometerBar = function (frame, speed, maxSpeed) {
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
    };
    FrameRenderer.prototype.writeStringToFrame = function (frame, x, y, str, attr) {
        for (var i = 0; i < str.length; i++) {
            frame.setData(x + i, y, str.charAt(i), attr);
        }
    };
    FrameRenderer.prototype.padLeft = function (str, len) {
        while (str.length < len) {
            str = ' ' + str;
        }
        return str;
    };
    FrameRenderer.prototype.cycle = function () {
        this.frameManager.cycle();
    };
    FrameRenderer.prototype.shutdown = function () {
        this.frameManager.shutdown();
        console.clear();
    };
    return FrameRenderer;
}());
