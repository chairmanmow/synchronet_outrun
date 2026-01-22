"use strict";
var ANSITunnelConfig = {
    directory: '/sbbs/text/futureland',
    scrollSpeed: 1.0,
    mirrorSky: true,
    colorShift: true
};
var ANSITunnelTheme = {
    name: 'ansi_tunnel',
    description: 'Race through scrolling ANSI art - a digital cyberspace tunnel',
    colors: {
        skyTop: { fg: BLACK, bg: BG_BLACK },
        skyMid: { fg: DARKGRAY, bg: BG_BLACK },
        skyHorizon: { fg: CYAN, bg: BG_BLACK },
        skyGrid: { fg: CYAN, bg: BG_BLACK },
        skyGridGlow: { fg: LIGHTCYAN, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_BLACK },
        celestialGlow: { fg: CYAN, bg: BG_BLACK },
        starBright: { fg: LIGHTCYAN, bg: BG_BLACK },
        starDim: { fg: CYAN, bg: BG_BLACK },
        sceneryPrimary: { fg: CYAN, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTCYAN, bg: BG_BLACK },
        sceneryTertiary: { fg: WHITE, bg: BG_BLACK },
        roadSurface: { fg: DARKGRAY, bg: BG_BLACK },
        roadSurfaceAlt: { fg: BLACK, bg: BG_BLACK },
        roadStripe: { fg: LIGHTCYAN, bg: BG_BLACK },
        roadEdge: { fg: CYAN, bg: BG_BLACK },
        roadGrid: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderSecondary: { fg: BLACK, bg: BG_BLACK },
        roadsideColors: {
            'data_beacon': {
                primary: { fg: LIGHTCYAN, bg: BG_BLACK },
                secondary: { fg: CYAN, bg: BG_BLACK }
            },
            'data_node': {
                primary: { fg: CYAN, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'signal_pole': {
                primary: { fg: LIGHTCYAN, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'binary_pillar': {
                primary: { fg: LIGHTCYAN, bg: BG_BLACK },
                secondary: { fg: CYAN, bg: BG_BLACK }
            }
        },
        itemBox: {
            border: { fg: LIGHTCYAN, bg: BG_BLACK },
            fill: { fg: DARKGRAY, bg: BG_BLACK },
            symbol: { fg: WHITE, bg: BG_BLACK }
        }
    },
    sky: {
        type: 'ansi',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'ansi',
        config: {
            parallaxSpeed: 0.0
        }
    },
    celestial: {
        type: 'none',
        size: 0,
        positionX: 0.5,
        positionY: 0.5
    },
    stars: {
        enabled: true,
        density: 0.1,
        twinkle: true
    },
    ground: {
        type: 'solid',
        primary: { fg: BLACK, bg: BG_BLACK },
        secondary: { fg: DARKGRAY, bg: BG_BLACK },
        pattern: {
            ditherDensity: 0.1,
            ditherChars: ['.', GLYPH.LIGHT_SHADE]
        }
    },
    roadside: {
        pool: [
            { sprite: 'data_beacon', weight: 3, side: 'both' },
            { sprite: 'data_node', weight: 2, side: 'both' },
            { sprite: 'signal_pole', weight: 2, side: 'both' },
            { sprite: 'binary_pillar', weight: 3, side: 'both' }
        ],
        spacing: 60,
        density: 0.5
    },
    hud: {
        speedLabel: 'Kbps',
        speedMultiplier: 0.24,
        positionPrefix: 'Node ',
        lapLabel: 'SECTOR',
        timeLabel: 'CONNECT'
    }
};
registerTheme(ANSITunnelTheme);
var ANSITunnelRenderer = (function () {
    function ANSITunnelRenderer() {
        this.ansiImages = [];
        this.currentImageIndex = 0;
        this.scrollOffset = 0;
        this.loaded = false;
        this.loadANSIFiles();
    }
    ANSITunnelRenderer.prototype.loadANSIFiles = function () {
        var files = ANSILoader.scanDirectory(ANSITunnelConfig.directory);
        if (files.length === 0) {
            logWarning("ANSITunnelRenderer: No ANSI files found in " + ANSITunnelConfig.directory);
            return;
        }
        var maxFiles = Math.min(files.length, 5);
        for (var i = 0; i < maxFiles; i++) {
            var img = ANSILoader.load(files[i], ANSITunnelConfig.directory);
            if (img) {
                this.ansiImages.push(img);
                logInfo("ANSITunnelRenderer: Loaded " + files[i] + " (" + img.width + "x" + img.height + ")");
            }
        }
        this.loaded = this.ansiImages.length > 0;
        logInfo("ANSITunnelRenderer: Loaded " + this.ansiImages.length + " ANSI images");
    };
    ANSITunnelRenderer.prototype.getCurrentImage = function () {
        if (!this.loaded || this.ansiImages.length === 0)
            return null;
        return this.ansiImages[this.currentImageIndex % this.ansiImages.length];
    };
    ANSITunnelRenderer.prototype.updateScroll = function (trackZ, trackLength) {
        var img = this.getCurrentImage();
        if (!img)
            return;
        var progress = (trackZ % trackLength) / trackLength;
        this.scrollOffset = progress * img.height;
        var lapNumber = Math.floor(trackZ / trackLength);
        if (lapNumber !== this.currentImageIndex && this.ansiImages.length > 1) {
            this.currentImageIndex = lapNumber % this.ansiImages.length;
        }
    };
    ANSITunnelRenderer.prototype.renderTunnel = function (frame, horizonY, roadBottom, screenWidth) {
        var img = this.getCurrentImage();
        if (!img) {
            this.renderFallback(frame, horizonY, roadBottom, screenWidth);
            return;
        }
        if (ANSITunnelConfig.mirrorSky) {
            this.renderSkyReflection(frame, img, horizonY, screenWidth);
        }
        this.renderRoadSurface(frame, img, horizonY, roadBottom, screenWidth);
    };
    ANSITunnelRenderer.prototype.renderSkyReflection = function (frame, img, horizonY, screenWidth) {
        for (var screenY = 0; screenY < horizonY; screenY++) {
            var distFromHorizon = horizonY - screenY;
            var t = distFromHorizon / horizonY;
            var ansiRow = Math.floor(this.scrollOffset + t * 20) % img.height;
            if (ansiRow < 0)
                ansiRow += img.height;
            var compression = 0.3 + t * 0.7;
            var centerX = screenWidth / 2;
            for (var screenX = 0; screenX < screenWidth; screenX++) {
                var offsetFromCenter = screenX - centerX;
                var ansiX = Math.floor(centerX + offsetFromCenter / compression);
                if (ansiX >= 0 && ansiX < img.width && ansiRow >= 0 && ansiRow < img.height) {
                    var cell = img.cells[ansiRow][ansiX];
                    var attr = cell.attr;
                    if (ANSITunnelConfig.colorShift) {
                        attr = this.shiftColorForSky(attr, t);
                    }
                    frame.setData(screenX, screenY, cell.char, attr);
                }
            }
        }
    };
    ANSITunnelRenderer.prototype.renderRoadSurface = function (frame, img, horizonY, roadBottom, screenWidth) {
        var roadHeight = roadBottom - horizonY;
        for (var screenY = horizonY; screenY < roadBottom; screenY++) {
            var rowInRoad = screenY - horizonY;
            var t = rowInRoad / roadHeight;
            var ansiRow = Math.floor(this.scrollOffset + (1 - t) * 30) % img.height;
            if (ansiRow < 0)
                ansiRow += img.height;
            var expansion = 0.5 + t * 1.5;
            var centerX = screenWidth / 2;
            for (var screenX = 0; screenX < screenWidth; screenX++) {
                var offsetFromCenter = screenX - centerX;
                var ansiX = Math.floor(centerX + offsetFromCenter / expansion);
                if (ansiX >= 0 && ansiX < img.width && ansiRow >= 0 && ansiRow < img.height) {
                    var cell = img.cells[ansiRow][ansiX];
                    frame.setData(screenX, screenY, cell.char, cell.attr);
                }
            }
        }
    };
    ANSITunnelRenderer.prototype.shiftColorForSky = function (attr, t) {
        var fg = attr & 0x0F;
        var bg = (attr >> 4) & 0x0F;
        if (t > 0.3) {
            if (fg === RED || fg === LIGHTRED)
                fg = MAGENTA;
            if (fg === YELLOW || fg === BROWN)
                fg = CYAN;
            if (fg === LIGHTGREEN || fg === GREEN)
                fg = LIGHTCYAN;
            if (fg === WHITE)
                fg = LIGHTCYAN;
            if (bg > 0 && bg < 8)
                bg = 0;
        }
        if (t > 0.7) {
            if (fg >= 8)
                fg = fg - 8;
        }
        return makeAttr(fg, bg << 4);
    };
    ANSITunnelRenderer.prototype.renderFallback = function (frame, horizonY, roadBottom, screenWidth) {
        var gridAttr = makeAttr(DARKGRAY, BG_BLACK);
        for (var y = 0; y < horizonY; y++) {
            var skyAttr = y < 2 ? makeAttr(BLACK, BG_BLACK) : makeAttr(DARKGRAY, BG_BLACK);
            for (var x = 0; x < screenWidth; x++) {
                frame.setData(x, y, ' ', skyAttr);
            }
        }
        for (var y = horizonY; y < roadBottom; y++) {
            for (var x = 0; x < screenWidth; x++) {
                var ch = (y + x) % 4 === 0 ? '.' : ' ';
                frame.setData(x, y, ch, gridAttr);
            }
        }
    };
    ANSITunnelRenderer.prototype.isLoaded = function () {
        return this.loaded;
    };
    return ANSITunnelRenderer;
}());
var ansiTunnelRenderer = null;
function getANSITunnelRenderer() {
    if (!ansiTunnelRenderer) {
        ansiTunnelRenderer = new ANSITunnelRenderer();
    }
    return ansiTunnelRenderer;
}
