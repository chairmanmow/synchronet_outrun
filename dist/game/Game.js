"use strict";
var DEFAULT_CONFIG = {
    screenWidth: 80,
    screenHeight: 24,
    tickRate: 60,
    maxTicksPerFrame: 5
};
var Game = (function () {
    function Game(config) {
        this.config = config || DEFAULT_CONFIG;
        this.running = false;
        this.paused = false;
        this.clock = new Clock();
        this.timestep = new FixedTimestep({
            tickRate: this.config.tickRate,
            maxTicksPerFrame: this.config.maxTicksPerFrame
        });
        this.inputMap = new InputMap();
        this.controls = new Controls(this.inputMap);
        this.renderer = new FrameRenderer(this.config.screenWidth, this.config.screenHeight);
        this.trackLoader = new TrackLoader();
        this.hud = new Hud();
        this.physicsSystem = new PhysicsSystem();
        this.raceSystem = new RaceSystem();
        this.itemSystem = new ItemSystem();
        this.state = null;
    }
    Game.prototype.initWithTrack = function (trackDef, raceMode) {
        logInfo("Game.initWithTrack(): " + trackDef.name + " mode: " + (raceMode || RaceMode.GRAND_PRIX));
        var mode = raceMode || RaceMode.GRAND_PRIX;
        this.renderer.init();
        var themeMapping = {
            'synthwave': 'synthwave',
            'midnight_city': 'city_night',
            'beach_paradise': 'sunset_beach',
            'forest_night': 'twilight_forest',
            'haunted_hollow': 'haunted_hollow',
            'winter_wonderland': 'winter_wonderland',
            'cactus_canyon': 'cactus_canyon',
            'tropical_jungle': 'tropical_jungle',
            'candy_land': 'candy_land',
            'rainbow_road': 'rainbow_road',
            'dark_castle': 'dark_castle',
            'villains_lair': 'villains_lair',
            'ancient_ruins': 'ancient_ruins',
            'thunder_stadium': 'thunder_stadium',
            'glitch_circuit': 'glitch_circuit',
            'kaiju_rampage': 'kaiju_rampage'
        };
        var themeName = themeMapping[trackDef.themeId] || 'synthwave';
        if (this.renderer.setTheme) {
            this.renderer.setTheme(themeName);
        }
        var road = buildRoadFromDefinition(trackDef);
        var track = this.trackLoader.load("neon_coast_01");
        track.laps = trackDef.laps;
        track.name = trackDef.name;
        var playerVehicle = new Vehicle();
        playerVehicle.driver = new HumanDriver(this.controls);
        playerVehicle.color = YELLOW;
        playerVehicle.isNPC = false;
        this.state = createInitialState(track, road, playerVehicle, mode);
        if (mode === RaceMode.GRAND_PRIX) {
            this.spawnRacers(7, road);
            this.positionOnStartingGrid(road);
            for (var i = 0; i < this.state.vehicles.length; i++) {
                var v = this.state.vehicles[i];
                var drv = v.driver;
                if (drv && drv.setCanMove) {
                    drv.setCanMove(false);
                }
            }
        }
        else {
            var npcCount = trackDef.npcCount !== undefined ? trackDef.npcCount : 5;
            this.spawnNPCs(npcCount, road);
            playerVehicle.trackZ = 0;
            playerVehicle.playerX = 0;
        }
        this.physicsSystem.init(this.state);
        this.raceSystem.init(this.state);
        this.itemSystem.initFromTrack(track);
        var totalRacers = mode === RaceMode.GRAND_PRIX ? 8 : 1;
        this.hud.init(totalRacers);
        this.running = true;
        this.state.racing = true;
        debugLog.info("Game initialized with track: " + trackDef.name);
        debugLog.info("  Race mode: " + mode);
        debugLog.info("  Road segments: " + road.segments.length);
        debugLog.info("  Road length: " + road.totalLength);
        debugLog.info("  Laps: " + road.laps);
        debugLog.info("  Total racers: " + this.state.vehicles.length);
    };
    Game.prototype.init = function () {
        logInfo("Game.init()");
        var defaultTrack = getTrackDefinition('test_oval');
        if (defaultTrack) {
            this.initWithTrack(defaultTrack, RaceMode.GRAND_PRIX);
        }
        else {
            this.initWithTrack({
                id: 'fallback',
                name: 'Fallback Track',
                description: 'Default fallback',
                difficulty: 1,
                laps: 2,
                themeId: 'synthwave',
                estimatedLapTime: 30,
                sections: [
                    { type: 'straight', length: 15 },
                    { type: 'curve', length: 15, curve: 0.5 },
                    { type: 'straight', length: 15 },
                    { type: 'curve', length: 15, curve: 0.5 }
                ]
            });
        }
    };
    Game.prototype.run = function () {
        debugLog.info("Entering game loop");
        this.clock.reset();
        var frameCount = 0;
        var lastLogTime = 0;
        while (this.running) {
            var deltaMs = this.clock.getDelta();
            frameCount++;
            this.processInput();
            if (!this.paused && this.state) {
                var ticks = this.timestep.update(deltaMs);
                for (var i = 0; i < ticks; i++) {
                    this.tick(this.timestep.getDt());
                }
                if (this.state.time - lastLogTime >= 1.0) {
                    debugLog.logVehicle(this.state.playerVehicle);
                    lastLogTime = this.state.time;
                }
                if (this.state.finished && this.state.racing === false) {
                    debugLog.info("Race complete! Final time: " + this.state.time.toFixed(2));
                    this.showGameOverScreen();
                    this.running = false;
                }
            }
            this.render();
            mswait(1);
        }
    };
    Game.prototype.processInput = function () {
        var now = this.clock.now();
        var key;
        while ((key = console.inkey(K_NONE, 0)) !== '') {
            this.controls.handleKey(key, now);
        }
        this.controls.update(now);
        if (this.controls.wasJustPressed(GameAction.QUIT)) {
            debugLog.info("QUIT action triggered - exiting game loop");
            this.running = false;
            this.controls.endFrame();
            return;
        }
        if (this.controls.wasJustPressed(GameAction.PAUSE)) {
            this.togglePause();
            this.controls.endFrame();
            return;
        }
        this.controls.endFrame();
    };
    Game.prototype.tick = function (dt) {
        if (!this.state)
            return;
        if (!this.state.raceStarted && this.state.raceMode === RaceMode.GRAND_PRIX) {
            this.state.countdown -= dt;
            if (this.state.countdown <= 0) {
                this.state.raceStarted = true;
                this.state.countdown = 0;
                this.state.time = 0;
                this.state.lapStartTime = 0;
                for (var i = 0; i < this.state.vehicles.length; i++) {
                    var vehicle = this.state.vehicles[i];
                    var driver = vehicle.driver;
                    if (driver && driver.setCanMove) {
                        driver.setCanMove(true);
                    }
                }
                debugLog.info("Race started! GO!");
            }
            return;
        }
        this.state.time += dt;
        this.physicsSystem.update(this.state, dt);
        this.raceSystem.update(this.state, dt);
        if (this.state.raceMode !== RaceMode.GRAND_PRIX) {
            this.activateDormantNPCs();
            this.applyNPCPacing();
        }
        this.itemSystem.update(dt);
        this.itemSystem.checkPickups(this.state.vehicles);
        if (this.controls.wasJustPressed(GameAction.USE_ITEM)) {
            this.itemSystem.useItem(this.state.playerVehicle);
        }
        Collision.processVehicleCollisions(this.state.vehicles);
        if (this.state.raceMode !== RaceMode.GRAND_PRIX) {
            this.checkNPCRespawn();
        }
        this.state.cameraX = this.state.playerVehicle.x;
    };
    Game.prototype.showGameOverScreen = function () {
        if (!this.state)
            return;
        debugLog.info("Showing game over screen, waiting for ENTER...");
        var player = this.state.playerVehicle;
        var finalPosition = player.racePosition;
        var finalTime = this.state.time;
        var bestLap = this.state.bestLapTime > 0 ? this.state.bestLapTime : 0;
        while (true) {
            this.renderResultsScreen(finalPosition, finalTime, bestLap);
            var key = console.inkey(K_NONE, 0);
            if (key === '\r' || key === '\n') {
                debugLog.info("ENTER pressed, exiting game over screen");
                break;
            }
            mswait(16);
        }
    };
    Game.prototype.renderResultsScreen = function (position, totalTime, bestLap) {
        this.renderer.beginFrame();
        var composer = this.renderer.getComposer();
        for (var y = 0; y < 25; y++) {
            for (var x = 0; x < 80; x++) {
                composer.setCell(x, y, ' ', makeAttr(BLACK, BG_BLACK));
            }
        }
        var titleAttr = colorToAttr({ fg: YELLOW, bg: BG_BLACK });
        var labelAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
        var valueAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
        var boxAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
        var promptAttr = colorToAttr({ fg: LIGHTMAGENTA, bg: BG_BLACK });
        var boxWidth = 40;
        var boxHeight = 12;
        var boxX = 20;
        var topY = 6;
        composer.setCell(boxX, topY, GLYPH.DBOX_TL, boxAttr);
        composer.setCell(boxX + boxWidth - 1, topY, GLYPH.DBOX_TR, boxAttr);
        composer.setCell(boxX, topY + boxHeight - 1, GLYPH.DBOX_BL, boxAttr);
        composer.setCell(boxX + boxWidth - 1, topY + boxHeight - 1, GLYPH.DBOX_BR, boxAttr);
        for (var i = 1; i < boxWidth - 1; i++) {
            composer.setCell(boxX + i, topY, GLYPH.DBOX_H, boxAttr);
            composer.setCell(boxX + i, topY + boxHeight - 1, GLYPH.DBOX_H, boxAttr);
        }
        for (var j = 1; j < boxHeight - 1; j++) {
            composer.setCell(boxX, topY + j, GLYPH.DBOX_V, boxAttr);
            composer.setCell(boxX + boxWidth - 1, topY + j, GLYPH.DBOX_V, boxAttr);
        }
        var title = "=== RACE COMPLETE ===";
        composer.writeString(boxX + Math.floor((boxWidth - title.length) / 2), topY + 2, title, titleAttr);
        var posSuffix = PositionIndicator.getOrdinalSuffix(position);
        composer.writeString(boxX + 4, topY + 4, "FINAL POSITION:", labelAttr);
        composer.writeString(boxX + 22, topY + 4, position + posSuffix, valueAttr);
        composer.writeString(boxX + 4, topY + 5, "TOTAL TIME:", labelAttr);
        composer.writeString(boxX + 22, topY + 5, LapTimer.format(totalTime), valueAttr);
        composer.writeString(boxX + 4, topY + 6, "BEST LAP:", labelAttr);
        composer.writeString(boxX + 22, topY + 6, bestLap > 0 ? LapTimer.format(bestLap) : "--:--.--", valueAttr);
        composer.writeString(boxX + 4, topY + 8, "TRACK:", labelAttr);
        composer.writeString(boxX + 22, topY + 8, this.state.track.name, valueAttr);
        var prompt = "Press ENTER to continue";
        composer.writeString(boxX + Math.floor((boxWidth - prompt.length) / 2), topY + 10, prompt, promptAttr);
        this.flushComposerToConsole(composer);
    };
    Game.prototype.flushComposerToConsole = function (composer) {
        console.home();
        var buffer = composer.getBuffer();
        for (var y = 0; y < buffer.length; y++) {
            var row = buffer[y];
            var line = '';
            var lastAttr = -1;
            for (var x = 0; x < row.length; x++) {
                var cell = row[x];
                if (cell.attr !== lastAttr) {
                    if (line.length > 0) {
                        console.print(line);
                        line = '';
                    }
                    console.attributes = cell.attr;
                    lastAttr = cell.attr;
                }
                line += cell.char;
            }
            if (line.length > 0) {
                console.print(line);
            }
        }
    };
    Game.prototype.activateDormantNPCs = function () {
        if (!this.state)
            return;
        var playerZ = this.state.playerVehicle.trackZ;
        var roadLength = this.state.road.totalLength;
        for (var i = 0; i < this.state.vehicles.length; i++) {
            var npc = this.state.vehicles[i];
            if (!npc.isNPC || npc.isRacer)
                continue;
            var driver = npc.driver;
            if (driver.isActive())
                continue;
            var dist = npc.trackZ - playerZ;
            if (dist < 0)
                dist += roadLength;
            if (dist < driver.getActivationRange()) {
                driver.activate();
                debugLog.info("NPC activated at distance " + dist.toFixed(0));
            }
        }
    };
    Game.prototype.checkNPCRespawn = function () {
        if (!this.state)
            return;
        var playerZ = this.state.playerVehicle.trackZ;
        var roadLength = this.state.road.totalLength;
        var respawnDistance = 100;
        var npcs = [];
        for (var i = 0; i < this.state.vehicles.length; i++) {
            if (this.state.vehicles[i].isNPC && !this.state.vehicles[i].isRacer) {
                npcs.push(this.state.vehicles[i]);
            }
        }
        if (npcs.length === 0)
            return;
        var idealSpacing = roadLength / npcs.length;
        var respawnCount = 0;
        for (var j = 0; j < npcs.length; j++) {
            var npc = npcs[j];
            var distBehind = playerZ - npc.trackZ;
            if (distBehind > respawnDistance) {
                var slotOffset = idealSpacing * (respawnCount + 1);
                var newZ = (playerZ + slotOffset) % roadLength;
                npc.trackZ = newZ;
                npc.z = newZ;
                var driver = npc.driver;
                driver.deactivate();
                npc.speed = 0;
                var laneChoice = Math.random();
                if (laneChoice < 0.4) {
                    npc.playerX = -0.35 + (Math.random() - 0.5) * 0.2;
                }
                else if (laneChoice < 0.8) {
                    npc.playerX = 0.35 + (Math.random() - 0.5) * 0.2;
                }
                else {
                    npc.playerX = (Math.random() - 0.5) * 0.3;
                }
                npc.isCrashed = false;
                npc.crashTimer = 0;
                npc.flashTimer = 0;
                respawnCount++;
            }
        }
    };
    Game.prototype.applyNPCPacing = function () {
        if (!this.state)
            return;
        var playerZ = this.state.playerVehicle.trackZ;
        var roadLength = this.state.road.totalLength;
        for (var i = 0; i < this.state.vehicles.length; i++) {
            var npc = this.state.vehicles[i];
            if (!npc.isNPC)
                continue;
            var driver = npc.driver;
            if (!driver.isActive())
                continue;
            var distance = npc.trackZ - playerZ;
            if (distance < 0)
                distance += roadLength;
            var commuterBaseSpeed = VEHICLE_PHYSICS.MAX_SPEED * driver.getSpeedFactor();
            if (distance < 100) {
                var slowFactor = 0.7 + (distance / 100) * 0.3;
                npc.speed = commuterBaseSpeed * slowFactor;
            }
            else {
                npc.speed = commuterBaseSpeed;
            }
        }
    };
    Game.prototype.render = function () {
        if (!this.state)
            return;
        var trackZ = this.state.playerVehicle.z;
        var vehicle = this.state.playerVehicle;
        var road = this.state.road;
        var curvature = road.getCurvature(trackZ);
        var playerSteer = vehicle.playerX;
        var speed = vehicle.speed;
        var dt = 1.0 / this.config.tickRate;
        this.renderer.beginFrame();
        this.renderer.renderSky(trackZ, curvature, playerSteer, speed, dt);
        this.renderer.renderRoad(trackZ, this.state.cameraX, this.state.track, this.state.road);
        this.renderer.renderEntities(this.state.playerVehicle, this.state.vehicles, this.itemSystem.getItemBoxes());
        var hudData = this.hud.compute(this.state.playerVehicle, this.state.track, this.state.road, this.state.vehicles, this.state.time, this.state.countdown, this.state.raceMode);
        this.renderer.renderHud(hudData);
        this.renderer.endFrame();
    };
    Game.prototype.togglePause = function () {
        this.paused = !this.paused;
        if (!this.paused) {
            this.clock.reset();
            this.timestep.reset();
        }
        logInfo("Game " + (this.paused ? "paused" : "resumed"));
    };
    Game.prototype.spawnRacers = function (count, _road) {
        if (!this.state)
            return;
        var racerColors = [
            { body: LIGHTRED, highlight: WHITE },
            { body: LIGHTBLUE, highlight: LIGHTCYAN },
            { body: LIGHTGREEN, highlight: WHITE },
            { body: LIGHTMAGENTA, highlight: WHITE },
            { body: LIGHTCYAN, highlight: WHITE },
            { body: WHITE, highlight: LIGHTGRAY },
            { body: BROWN, highlight: YELLOW }
        ];
        var skillLevels = [0.82, 0.75, 0.58, 0.52, 0.42, 0.38, 0.35];
        for (var i = 0; i < count && i < racerColors.length; i++) {
            var racer = new Vehicle();
            var skill = skillLevels[i] || 0.6;
            racer.driver = new RacerDriver(skill);
            racer.isNPC = true;
            racer.isRacer = true;
            var typeIndex = Math.floor(Math.random() * NPC_VEHICLE_TYPES.length);
            racer.npcType = NPC_VEHICLE_TYPES[typeIndex];
            var colorPalette = racerColors[i];
            racer.color = colorPalette.body;
            racer.npcColorIndex = i;
            racer.trackZ = 0;
            racer.z = 0;
            racer.playerX = 0;
            this.state.vehicles.push(racer);
        }
        debugLog.info("Spawned " + count + " CPU racers for Grand Prix");
    };
    Game.prototype.positionOnStartingGrid = function (_road) {
        if (!this.state)
            return;
        var vehicles = this.state.vehicles;
        var gridColSpacing = 0.4;
        var startZ = 0;
        var playerIdx = -1;
        for (var p = 0; p < vehicles.length; p++) {
            if (!vehicles[p].isNPC) {
                playerIdx = p;
                break;
            }
        }
        var gridSlot = 0;
        for (var v = 0; v < vehicles.length; v++) {
            var vehicle = vehicles[v];
            vehicle.trackZ = startZ;
            vehicle.z = startZ;
            if (v === playerIdx) {
                vehicle.playerX = 0;
            }
            else {
                var side = (gridSlot % 2 === 0) ? -1 : 1;
                var offset = Math.floor(gridSlot / 2) * 0.15;
                vehicle.playerX = side * (gridColSpacing + offset);
                gridSlot++;
            }
            vehicle.speed = 0;
            vehicle.lap = 1;
            vehicle.checkpoint = 0;
            vehicle.racePosition = v + 1;
            debugLog.info("Grid position " + (v + 1) + ": Z=" + vehicle.trackZ.toFixed(0) + " X=" + vehicle.playerX.toFixed(2));
        }
        debugLog.info("Positioned " + vehicles.length + " vehicles on starting grid");
    };
    Game.prototype.spawnNPCs = function (count, road) {
        if (!this.state)
            return;
        var roadLength = road.totalLength;
        var spacing = roadLength / count;
        for (var i = 0; i < count; i++) {
            var npc = new Vehicle();
            npc.driver = new CommuterDriver();
            npc.isNPC = true;
            var typeIndex = Math.floor(Math.random() * NPC_VEHICLE_TYPES.length);
            npc.npcType = NPC_VEHICLE_TYPES[typeIndex];
            npc.npcColorIndex = Math.floor(Math.random() * NPC_VEHICLE_COLORS.length);
            var colorPalette = NPC_VEHICLE_COLORS[npc.npcColorIndex];
            npc.color = colorPalette.body;
            var baseZ = spacing * i;
            var jitter = spacing * 0.2 * (Math.random() - 0.5);
            npc.trackZ = (baseZ + jitter + roadLength) % roadLength;
            npc.z = npc.trackZ;
            var laneOffset = (i % 2 === 0) ? -0.3 : 0.3;
            npc.playerX = laneOffset + (Math.random() - 0.5) * 0.4;
            this.state.vehicles.push(npc);
        }
        debugLog.info("Spawned " + count + " NPC commuters");
    };
    Game.prototype.isRunning = function () {
        return this.running;
    };
    Game.prototype.shutdown = function () {
        logInfo("Game.shutdown()");
        this.renderer.shutdown();
        this.controls.clearAll();
    };
    return Game;
}());
