"use strict";

load("sbbsdefs.js");
require("key_defs.js", "KEY_LEFT");
require("key_defs.js", "KEY_RIGHT");
require("key_defs.js", "KEY_UP");
require("key_defs.js", "KEY_DOWN");
require("key_defs.js", "KEY_ESC");
require("key_defs.js", "KEY_ABORT");

(function () {
	const originalStatus = console.status;
	const originalAttr = console.attributes;
	const originalPause = bbs.sys_status & SS_PAUSEON;

	const width = console.screen_columns;
	const height = console.screen_rows;
	const HUD_ROWS = 3;
	const viewRows = height - HUD_ROWS;

	const SKY_ROWS = Math.max(4, Math.floor(viewRows * 0.34));
	const SCREEN_LAST_ROW = height;
	const SCREEN_LAST_COL = width - 1;

	const VIEW_DEPTH = 1800; // meters projected ahead
	const MAX_SPEED = 320; // km/h
	const ACCEL = 130; // km/h per second
	const BRAKE = 220;
	const RELEASE_DECEL = 55;
	const OFFROAD_DECEL = 240;
	const OFFROAD_SPEED_CAP = 180;
	const STEER_RATE = 1.8; // lateral units per second (base)
	const CURVE_PULL = 0.0016;
	const OFFROAD_LIMIT = 1.05;
	const LATERAL_MAX = 1.35;
	const SCORE_RATE = 12;
	const FRAME_MS = 1000 / 22;
	const TREE_SPACING = 220;
	const LANE_STRIPE = 120;
	const CAMERA_INFLUENCE = width * 0.58;
	const CURVE_SCALE = width * 0.26;
	const BASE_ROAD_WIDTH = width * 0.08;
	const ROAD_EXPANSION = width * 0.75;
	const SHOULDER_RATIO = 0.22;
	const LANE_COUNT = 3;
	const LANE_MARK_WIDTH = 1;
	const CAR_ROW_BASE = height - 2;
	const CAR_RANGE = width * 0.28;
	const INPUT_HOLD = 0.18;
	const SPEED_GAUGE_WIDTH = Math.min(26, Math.floor(width * 0.38));

	const CHAR_GRASS = ascii(176);      // ░
	const CHAR_GRASS_DETAIL = ascii(177);// ▒
	const CHAR_SHOULDER = ascii(219);   // █
	const CHAR_ROAD_SOLID = ascii(219); // █
	const CHAR_ROAD_LIGHT = ascii(178); // ▓
	const CHAR_LANE = ascii(179);       // │
	const CHAR_TREE = ascii(5);         // ♣
	const CHAR_SIGN = ascii(222);       // ▾
	const CHAR_SKY = " ";
	const CHAR_MOUNTAIN = ascii(30);    // ▲
	const GAUGE_FULL_CHAR = ascii(219);
	const GAUGE_EMPTY_CHAR = ascii(176);

	const HUD_ATTR = BG_BLUE | WHITE;
	const HUD_TITLE_ATTR = BG_BLUE | YELLOW;
	const HUD_INFO_ATTR = BG_BLUE | LIGHTCYAN;
	const SKY_ATTRS = [
		BG_MAGENTA | LIGHTRED,
		BG_RED | YELLOW,
		BG_CYAN | LIGHTCYAN,
		BG_BLUE | LIGHTBLUE
	];
	const GRASS_ATTRS = [
		BG_GREEN | LIGHTGREEN,
		BG_BROWN | YELLOW
	];
	const SHOULDER_ATTRS = [
		BG_RED | WHITE,
		BG_LIGHTGRAY | RED
	];
	const ROAD_ATTRS = [
		BG_BLACK | LIGHTGRAY,
		BG_BLACK | DARKGRAY
	];
	const LANE_ATTR = BG_BLACK | WHITE;
	const CAR_ATTR_TOP = BG_RED | WHITE;
	const CAR_ATTR_BOTTOM = BG_RED | YELLOW;
	const CAR_ATTR_SIDE = BG_RED | WHITE;
	const CAR_ATTR_WINDOW = BG_BLUE | LIGHTGRAY;
	const TAIL_LIGHT_ATTR = BG_BLACK | LIGHTMAGENTA;
	const CAR_WHEEL_ATTR = BG_BLACK | DARKGRAY;
	const TREE_ATTR = BG_GREEN | YELLOW;
	const SIGN_ATTR = BG_BROWN | WHITE;
	const MOUNTAIN_ATTRS = [
		BG_CYAN | LIGHTMAGENTA,
		BG_BLUE | LIGHTMAGENTA,
		BG_BLUE | LIGHTCYAN
	];
	const SUN_SHAPE = [
		{ dx: 0, dy: 0, ch: ascii(15), attr: BG_RED | YELLOW },
		{ dx: -1, dy: 0, ch: ascii(248), attr: BG_RED | LIGHTRED },
		{ dx: 1, dy: 0, ch: ascii(248), attr: BG_RED | LIGHTRED },
		{ dx: 0, dy: -1, ch: ascii(248), attr: BG_RED | LIGHTRED },
		{ dx: 0, dy: 1, ch: ascii(248), attr: BG_RED | LIGHTRED }
	];

	const fillCache = {};
	const hudCache = {
		title: "",
		status: "",
		gauge: "",
		help: ""
	};
var hudPrepared = false;
var gaugeInitialized = false;
var gaugeStartColumn = 0;
var lastGaugeFill = -1;
var currentGaugeWidth = SPEED_GAUGE_WIDTH;
var statusInitialized = false;
var speedValueCol = 0;
var distValueCol = 0;
var scoreValueCol = 0;
var lastHudSpeed = -1;
var lastHudDist = -1;
var lastHudScore = -1;
	var running = true;
	var speed = 0;
	var position = 0;
	var score = 0;
	var playerX = 0;
	const inputHold = {
		accel: 0,
		brake: 0,
		left: 0,
		right: 0
	};
	const mountainProfile = buildMountainProfile(width, SKY_ROWS);

	console.status |= CON_RAW_IN;
	bbs.sys_status &= ~SS_PAUSEON;
	console.clear(BG_BLUE | LIGHTCYAN);

	const CAR_SPRITE = [
		{
			dy: -2,
			glyphs: [
				{ dx: -2, ch: String.fromCharCode(201), attr: CAR_ATTR_TOP }, // ╔
				{ dx: -1, ch: String.fromCharCode(203), attr: CAR_ATTR_TOP }, // ╦
				{ dx: 0, ch: String.fromCharCode(203), attr: CAR_ATTR_TOP },  // ╦
				{ dx: 1, ch: String.fromCharCode(203), attr: CAR_ATTR_TOP },  // ╦
				{ dx: 2, ch: String.fromCharCode(187), attr: CAR_ATTR_TOP }   // ╗
			]
		},
		{
			dy: -1,
			glyphs: [
				{ dx: -2, ch: String.fromCharCode(186), attr: CAR_ATTR_SIDE }, // ║
				{ dx: -1, ch: ascii(178), attr: CAR_ATTR_WINDOW },             // ▓ window
				{ dx: 0, ch: ascii(177), attr: CAR_ATTR_WINDOW },              // ▒ window
				{ dx: 1, ch: ascii(178), attr: CAR_ATTR_WINDOW },              // ▓ window
				{ dx: 2, ch: String.fromCharCode(186), attr: CAR_ATTR_SIDE }   // ║
			]
		},
		{
			dy: 0,
			glyphs: [
				{ dx: -2, ch: String.fromCharCode(200), attr: CAR_ATTR_BOTTOM }, // ╚
				{ dx: -1, ch: String.fromCharCode(202), attr: CAR_ATTR_BOTTOM }, // ╩
				{ dx: 0, ch: ascii(164), attr: TAIL_LIGHT_ATTR },                 // ¤ tail lights
				{ dx: 1, ch: String.fromCharCode(202), attr: CAR_ATTR_BOTTOM },   // ╩
				{ dx: 2, ch: String.fromCharCode(188), attr: CAR_ATTR_BOTTOM }    // ╝
			]
		},
		{
			dy: 1,
			glyphs: [
				{ dx: -1, ch: ascii(223), attr: CAR_WHEEL_ATTR }, // ▀
				{ dx: 1, ch: ascii(223), attr: CAR_WHEEL_ATTR }   // ▀
			]
		}
	];

	function clamp(value, min, max) {
		return value < min ? min : value > max ? max : value;
	}

	function cachedFill(ch, len) {
		if (len <= 0) return "";
		var store = fillCache[ch];
		if (!store) {
			store = {};
			fillCache[ch] = store;
		}
		var str = store[len];
		if (!str) {
			str = new Array(len + 1).join(ch);
			store[len] = str;
		}
		return str;
	}

	function buildMountainProfile(cols, rows) {
		var profile = [];
		var maxHeight = Math.max(2, rows - 1);
		for (var x = 0; x < cols; x++) {
			var nx = x / cols;
			var wave = Math.sin(nx * Math.PI * 1.4) * 0.6 + Math.sin(nx * Math.PI * 2.8 + 1.1) * 0.4;
			var ridge = Math.sin(nx * Math.PI * 5.2 + 2.3) * 0.15;
			var height = Math.floor(((wave + 1) * 0.5 + ridge) * maxHeight);
			if (height < 1) height = 1;
			if (height > maxHeight) height = maxHeight;
			profile.push(height);
		}
		return profile;
	}

	function prepareHudBackground() {
		if (hudPrepared)
			return;
		for (var r = 1; r <= HUD_ROWS; r++) {
			fillSpan(r, 0, width, HUD_ATTR, CHAR_SKY);
		}
		hudPrepared = true;
	}

	function writeCenteredHud(row, attr, text, key) {
		if (hudCache[key] === text)
			return;
		var left = Math.max(0, Math.floor((width - text.length) / 2));
		var output = "";
		if (left > 0)
			output += cachedFill(" ", left);
		output += text;
		if (output.length < width)
			output += cachedFill(" ", width - output.length);
		else if (output.length > width)
			output = output.substr(0, width);
		console.attr = attr;
		console.gotoxy(1, row);
		console.print(output);
		hudCache[key] = text;
	}

	function writeHudRow(row, attr, text, key) {
		if (hudCache[key] === text)
			return;
		var output = text;
		if (output.length < width)
			output += cachedFill(" ", width - output.length);
		else if (output.length > width)
			output = output.substr(0, width);
		console.attr = attr;
		console.gotoxy(1, row);
		console.print(output);
		hudCache[key] = text;
	}

	function fillSpan(row, start, end, attr, ch) {
		start = Math.floor(start);
		end = Math.ceil(end);
		if (end <= start) return;
		if (row < 1 || row > height) return;
		if (end < 0 || start > SCREEN_LAST_COL) return;
		var x1 = start < 0 ? 0 : start;
		var x2 = end > width ? width : end;
		var len = x2 - x1;
		if (len <= 0) return;
		console.attr = attr;
		console.gotoxy(x1 + 1, row);
		console.print(cachedFill(ch, len));
	}

	function drawGlyph(row, col, attr, ch) {
		if (row < 1 || row > height) return;
		if (col < 0 || col > SCREEN_LAST_COL) return;
		console.attr = attr;
		console.gotoxy(col + 1, row);
		console.print(ch);
	}

	function sampleCurve(z) {
		const t = z * 0.00055;
		const envelope = Math.sin(t * 0.13 + 1.7) * 0.5 + 0.5;
		const longWave = Math.sin(t) * 1.25;
		const midWave = Math.sin(t * 1.9 + Math.cos(t * 0.33)) * 0.6;
		const shortWave = Math.sin(t * 3.7 + 2.4) * 0.25;
		return (longWave * (0.35 + envelope) + midWave + shortWave) * 0.6;
	}

	function drawHUD() {
		prepareHudBackground();

		const title = " SYNCHRONET OUTRUN CP437 ";
		writeCenteredHud(1, HUD_TITLE_ATTR, title, "title");

		if (!statusInitialized) {
			var speedLabel = "Speed:";
			var speedUnit = " km/h";
			var distLabel = "Dist:";
			var distUnit = " km";
			var scoreLabel = "Score:";
			var rowBuilder = speedLabel + " ";
			speedValueCol = rowBuilder.length + 1;
			rowBuilder += "   ";
			rowBuilder += speedUnit + "  " + distLabel + " ";
			distValueCol = rowBuilder.length + 1;
			rowBuilder += "     ";
			rowBuilder += distUnit + "  " + scoreLabel + " ";
			scoreValueCol = rowBuilder.length + 1;
			rowBuilder += "       ";
			if (rowBuilder.length < width)
				rowBuilder += cachedFill(" ", width - rowBuilder.length);
			else if (rowBuilder.length > width)
				rowBuilder = rowBuilder.substr(0, width);
			writeHudRow(2, HUD_INFO_ATTR, rowBuilder, "status");
			statusInitialized = true;
			lastHudSpeed = -1;
			lastHudDist = -1;
			lastHudScore = -1;
		}

		var kmh = Math.round(speed);
		if (kmh !== lastHudSpeed) {
			console.attr = HUD_INFO_ATTR;
			console.gotoxy(speedValueCol, 2);
			console.print(format("%3d", kmh));
			lastHudSpeed = kmh;
		}

		var distTenth = Math.floor(position / 100);
		if (distTenth !== lastHudDist) {
			console.attr = HUD_INFO_ATTR;
			console.gotoxy(distValueCol, 2);
			console.print(format("%5.1f", distTenth / 10));
			lastHudDist = distTenth;
		}

		var scoreDisplay = Math.floor(score / 5) * 5;
		if (scoreDisplay !== lastHudScore) {
			console.attr = HUD_INFO_ATTR;
			console.gotoxy(scoreValueCol, 2);
			console.print(format("%07d", scoreDisplay));
			lastHudScore = scoreDisplay;
		}

		const help = "Up accel  Down brake  Left/Right steer  ESC quit";
		const gaugeLabel = "Throttle [";
		const gaugeSuffix = "]";
		var maxGaugeSpace = width - (gaugeLabel.length + gaugeSuffix.length + 2 + help.length);
		if (maxGaugeSpace < 0)
			maxGaugeSpace = 0;
		var desiredGaugeWidth = Math.min(SPEED_GAUGE_WIDTH, maxGaugeSpace);
		if (desiredGaugeWidth !== currentGaugeWidth) {
			gaugeInitialized = false;
			currentGaugeWidth = desiredGaugeWidth;
		}
		var gaugeWidth = currentGaugeWidth;
		var gaugeFill = gaugeWidth > 0 ? Math.min(gaugeWidth, Math.round((speed / MAX_SPEED) * gaugeWidth)) : 0;

		if (!gaugeInitialized) {
			var baseBar = gaugeWidth > 0 ? cachedFill(GAUGE_EMPTY_CHAR, gaugeWidth) : "";
			var gaugeLine = gaugeLabel + baseBar + gaugeSuffix + "  " + help;
			if (gaugeLine.length < width)
				gaugeLine += cachedFill(" ", width - gaugeLine.length);
			else if (gaugeLine.length > width)
				gaugeLine = gaugeLine.substr(0, width);
			writeHudRow(3, HUD_INFO_ATTR, gaugeLine, "gauge");
			gaugeStartColumn = gaugeLabel.length + 1;
			gaugeInitialized = true;
			lastGaugeFill = -1;
		}

		if (gaugeWidth > 0 && gaugeFill !== lastGaugeFill) {
			var fillString = "";
			if (gaugeFill > 0)
				fillString += cachedFill(GAUGE_FULL_CHAR, gaugeFill);
			if (gaugeFill < gaugeWidth)
				fillString += cachedFill(GAUGE_EMPTY_CHAR, gaugeWidth - gaugeFill);
			console.attr = HUD_INFO_ATTR;
			console.gotoxy(gaugeStartColumn, HUD_ROWS);
			console.print(fillString);
			lastGaugeFill = gaugeFill;
		}

		if (hudCache.help !== help) {
			var helpStart = Math.max(gaugeLabel.length + gaugeWidth + gaugeSuffix.length + 3, 1);
			console.attr = HUD_INFO_ATTR;
			console.gotoxy(helpStart, HUD_ROWS);
			var helpText = help;
			if (helpText.length + helpStart - 1 > width)
				helpText = helpText.substr(0, Math.max(0, width - helpStart + 1));
			console.print(helpText);
			hudCache.help = help;
		}
	}

	function drawCar() {
		const carCol = clamp(Math.round(width / 2 + playerX * CAR_RANGE), 2, SCREEN_LAST_COL - 2);
		for (var i = 0; i < CAR_SPRITE.length; i++) {
			var layer = CAR_SPRITE[i];
			var row = CAR_ROW_BASE + layer.dy;
			if (row < HUD_ROWS + 1 || row > SCREEN_LAST_ROW) continue;
			for (var g = 0; g < layer.glyphs.length; g++) {
				var glyph = layer.glyphs[g];
				drawGlyph(row, carCol + glyph.dx, glyph.attr, glyph.ch);
			}
		}
	}

	function drawSun() {
		var baseRow = HUD_ROWS + Math.max(1, Math.floor(SKY_ROWS * 0.45));
		var centerCol = clamp(Math.floor(width * 0.18), 2, SCREEN_LAST_COL - 2);
		for (var i = 0; i < SUN_SHAPE.length; i++) {
			var part = SUN_SHAPE[i];
			drawGlyph(baseRow + part.dy, centerCol + part.dx, part.attr, part.ch);
		}
	}

	function drawMountains() {
		var baseRow = HUD_ROWS + SKY_ROWS;
		for (var x = 0; x < width; x++) {
			var heightVal = mountainProfile[x % mountainProfile.length];
			for (var m = 0; m < heightVal; m++) {
				var row = baseRow - m;
				if (row <= HUD_ROWS)
					break;
				var attr = MOUNTAIN_ATTRS[m % MOUNTAIN_ATTRS.length];
				drawGlyph(row, x, attr, CHAR_MOUNTAIN);
			}
		}
	}

	function drawWorld() {
		for (var sr = 0; sr < SKY_ROWS; sr++) {
			var attr = SKY_ATTRS[sr % SKY_ATTRS.length];
			fillSpan(HUD_ROWS + 1 + sr, 0, width, attr, CHAR_SKY);
		}
		drawSun();
		drawMountains();

		const startRow = HUD_ROWS + SKY_ROWS + 1;
		const rowsRemaining = height - (startRow - 1);
		for (var idx = 0; idx < rowsRemaining; idx++) {
			var row = startRow + idx;
			var depthRatio = (idx + 1) / rowsRemaining;
			var worldZ = position + depthRatio * VIEW_DEPTH;
			var curve = sampleCurve(worldZ);
			var center = width / 2 - playerX * depthRatio * CAMERA_INFLUENCE + curve * Math.pow(depthRatio, 1.45) * CURVE_SCALE;

			var roadWidth = BASE_ROAD_WIDTH + Math.pow(depthRatio, 2.2) * ROAD_EXPANSION;
			var leftEdge = Math.round(center - roadWidth / 2);
			var rightEdge = Math.round(center + roadWidth / 2);

			if (rightEdge < leftEdge) {
				var swap = leftEdge;
				leftEdge = rightEdge;
				rightEdge = swap;
			}

			if (leftEdge < -width) leftEdge = -width;
			if (rightEdge > width * 2) rightEdge = width * 2;

			var grassAttr = GRASS_ATTRS[(Math.floor(worldZ / 50) + idx) & 1];
			var grassChar = ((Math.floor(worldZ / 70) + idx) & 1) === 0 ? CHAR_GRASS : CHAR_GRASS_DETAIL;
			fillSpan(row, 0, width, grassAttr, grassChar);

			var actualRoadWidth = rightEdge - leftEdge;
			if (actualRoadWidth <= 2) continue;

			var shoulderWidth = Math.max(1, Math.floor(actualRoadWidth * SHOULDER_RATIO));
			if (shoulderWidth * 2 >= actualRoadWidth) shoulderWidth = Math.max(1, Math.floor(actualRoadWidth / 4));

			var roadAttr = ROAD_ATTRS[(Math.floor(worldZ / 22) + idx) & 1];
			var shoulderAttrLeft = SHOULDER_ATTRS[(Math.floor(worldZ / 35) + idx) & 1];
			var shoulderAttrRight = SHOULDER_ATTRS[(Math.floor(worldZ / 35) + idx + 1) & 1];

			fillSpan(row, leftEdge, rightEdge, roadAttr, CHAR_ROAD_SOLID);

		var midSpan = Math.max(2, Math.floor(actualRoadWidth * 0.18));
		if (midSpan > actualRoadWidth - 2)
			midSpan = Math.max(2, actualRoadWidth - 2);
		if (midSpan > 0) {
			var midStart = Math.round(center - midSpan / 2);
			fillSpan(row, midStart, midStart + midSpan, roadAttr, CHAR_ROAD_LIGHT);
		}

			fillSpan(row, leftEdge, leftEdge + shoulderWidth, shoulderAttrLeft, CHAR_SHOULDER);
			fillSpan(row, rightEdge - shoulderWidth, rightEdge, shoulderAttrRight, CHAR_SHOULDER);

			var laneInnerStart = leftEdge + shoulderWidth;
			var laneInnerEnd = rightEdge - shoulderWidth;
			var laneSpan = laneInnerEnd - laneInnerStart;
			if (laneSpan > LANE_COUNT * 2) {
				var dashed = ((Math.floor(worldZ / LANE_STRIPE) + idx) & 1) === 0;
				if (dashed) {
					var step = laneSpan / LANE_COUNT;
					for (var lane = 1; lane < LANE_COUNT; lane++) {
						var x = Math.round(laneInnerStart + step * lane);
						fillSpan(row, x, x + LANE_MARK_WIDTH, LANE_ATTR, CHAR_LANE);
					}
				}
			}

			var treeIndex = Math.floor(worldZ / TREE_SPACING);
			if ((treeIndex & 1) === 0) {
				drawGlyph(row, leftEdge - shoulderWidth - 2, TREE_ATTR, CHAR_TREE);
				drawGlyph(row, rightEdge + shoulderWidth + 1, TREE_ATTR, CHAR_TREE);
			} else if ((treeIndex & 3) === 1) {
				drawGlyph(row, leftEdge - shoulderWidth - 3, SIGN_ATTR, CHAR_SIGN);
				drawGlyph(row, rightEdge + shoulderWidth + 2, SIGN_ATTR, CHAR_SIGN);
			}
		}
	}

	function pollInput(dt) {
		inputHold.accel = Math.max(0, inputHold.accel - dt);
		inputHold.brake = Math.max(0, inputHold.brake - dt);
		inputHold.left = Math.max(0, inputHold.left - dt);
		inputHold.right = Math.max(0, inputHold.right - dt);

		var key;
		while ((key = console.inkey(K_NONE, 0)) !== "") {
			if (key === KEY_ESC) {
				if (!handleEscapeSequence()) {
					running = false;
					break;
				}
				continue;
			}
			switch (key) {
				case KEY_ABORT:
					running = false;
					break;
				case KEY_UP:
					inputHold.accel = INPUT_HOLD;
					break;
				case KEY_DOWN:
					inputHold.brake = INPUT_HOLD;
					break;
				case KEY_LEFT:
					inputHold.left = INPUT_HOLD;
					break;
				case KEY_RIGHT:
					inputHold.right = INPUT_HOLD;
					break;
			}
		}
		return {
			accel: inputHold.accel > 0,
			brake: inputHold.brake > 0,
			left: inputHold.left > 0,
			right: inputHold.right > 0
		};
	}

	function handleEscapeSequence() {
		var seq = "";
		var next = console.inkey(K_NONE, 0);
		if (next === "") {
			return false;
		}
		seq += next;
		var more;
		while ((more = console.inkey(K_NONE, 0)) !== "") {
			seq += more;
			if (seq.length > 6) {
				break;
			}
		}

		var first = seq.charAt(0);
		var finalChar = seq.charAt(seq.length - 1);
		if (first === "[" || first === "O") {
			switch (finalChar) {
				case "A":
					inputHold.accel = INPUT_HOLD;
					return true;
				case "B":
					inputHold.brake = INPUT_HOLD;
					return true;
				case "C":
					inputHold.right = INPUT_HOLD;
					return true;
				case "D":
					inputHold.left = INPUT_HOLD;
					return true;
			}
		}
		return false;
	}

	function updateState(dt, control) {
		if (control.accel) {
			speed += ACCEL * dt;
		} else {
			speed -= RELEASE_DECEL * dt;
		}
		if (control.brake) {
			speed -= BRAKE * dt;
		}

		const steerFactor = (speed / MAX_SPEED) + 0.4;
		if (control.left) {
			playerX -= STEER_RATE * steerFactor * dt;
		}
		if (control.right) {
			playerX += STEER_RATE * steerFactor * dt;
		}

		const curve = sampleCurve(position + 40);
		playerX -= curve * speed * dt * CURVE_PULL;

		playerX = clamp(playerX, -LATERAL_MAX, LATERAL_MAX);

		const offroad = Math.abs(playerX) > OFFROAD_LIMIT;
		if (offroad) {
			speed -= OFFROAD_DECEL * dt;
			if (speed > OFFROAD_SPEED_CAP) {
				speed = Math.max(OFFROAD_SPEED_CAP, speed - OFFROAD_DECEL * dt * 0.5);
			}
		}

		speed = clamp(speed, 0, MAX_SPEED);

		const metersPerSecond = speed * (1000 / 3600);
		position += metersPerSecond * dt;
		score += speed * dt * SCORE_RATE * (offroad ? 0.3 : 1);
	}

	function gameLoop() {
		var last = Date.now();
		while (running && !js.terminated) {
			const frameStart = Date.now();
			const dt = clamp((frameStart - last) / 1000, 0.01, 0.12);
			last = frameStart;

			const control = pollInput(dt);
			updateState(dt, control);

			drawHUD();
			drawWorld();
			drawCar();

			const elapsed = Date.now() - frameStart;
			const sleepTime = FRAME_MS - elapsed;
			if (sleepTime > 0)
				sleep(sleepTime);
		}
	}

	try {
		gameLoop();
	} finally {
		console.attr = originalAttr;
		console.status = originalStatus;
		if (originalPause)
			bbs.sys_status |= SS_PAUSEON;
		console.gotoxy(1, height);
		console.crlf();
		console.print("Thanks for racing!");
		console.crlf();
	}
}());
