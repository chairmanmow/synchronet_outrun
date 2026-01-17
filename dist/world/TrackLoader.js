"use strict";
var TrackLoader = (function () {
    function TrackLoader() {
    }
    TrackLoader.prototype.load = function (trackId) {
        logInfo("TrackLoader: Loading track '" + trackId + "'");
        if (trackId === "neon_coast_01") {
            return this.loadNeonCoast();
        }
        logWarning("TrackLoader: Unknown track '" + trackId + "', using default");
        return this.loadNeonCoast();
    };
    TrackLoader.prototype.loadNeonCoast = function () {
        var track = new Track();
        track.name = "Neon Coast";
        track.width = 40;
        track.laps = 3;
        track.centerline = [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 200, y: 50 },
            { x: 250, y: 150 },
            { x: 200, y: 250 },
            { x: 100, y: 300 },
            { x: 0, y: 300 },
            { x: -100, y: 250 },
            { x: -150, y: 150 },
            { x: -100, y: 50 }
        ];
        track.length = this.calculateTrackLength(track.centerline);
        track.checkpoints = [
            { z: 0 },
            { z: track.length * 0.25 },
            { z: track.length * 0.5 },
            { z: track.length * 0.75 }
        ];
        track.spawnPoints = [
            { x: -5, z: -10 },
            { x: 5, z: -10 },
            { x: -5, z: -25 },
            { x: 5, z: -25 },
            { x: -5, z: -40 },
            { x: 5, z: -40 },
            { x: -5, z: -55 },
            { x: 5, z: -55 }
        ];
        track.scenery = {
            sky: {
                type: 'sunset',
                sunAzimuth: 270,
                horizonColors: ['#ff00ff', '#ff6600', '#ffff00']
            },
            props: {
                palmTrees: 0.7,
                buildings: 0.3,
                billboards: 0.2
            },
            road: {
                color: '#333333',
                stripeColor: '#ffffff',
                stripeWidth: 2
            },
            skyline: {
                style: 'city',
                density: 0.6
            }
        };
        return track;
    };
    TrackLoader.prototype.calculateTrackLength = function (centerline) {
        var length = 0;
        for (var i = 0; i < centerline.length; i++) {
            var p1 = centerline[i];
            var p2 = centerline[(i + 1) % centerline.length];
            length += distance(p1, p2);
        }
        return length;
    };
    TrackLoader.prototype.parseTrackJson = function (data) {
        var _a, _b, _c, _d, _e, _f, _g;
        var track = new Track();
        track.name = ((_a = data.meta) === null || _a === void 0 ? void 0 : _a.name) || "Unknown";
        track.laps = ((_b = data.race) === null || _b === void 0 ? void 0 : _b.laps) || 3;
        track.width = ((_c = data.geometry) === null || _c === void 0 ? void 0 : _c.width) || 40;
        track.centerline = (((_d = data.geometry) === null || _d === void 0 ? void 0 : _d.centerline) || []).map(function (p) {
            return { x: p[0], y: p[1] };
        });
        track.length = ((_e = data.geometry) === null || _e === void 0 ? void 0 : _e.length) || this.calculateTrackLength(track.centerline);
        track.checkpoints = (((_f = data.race) === null || _f === void 0 ? void 0 : _f.checkpoints) || []).map(function (z) {
            return { z: z };
        });
        track.spawnPoints = ((_g = data.race) === null || _g === void 0 ? void 0 : _g.spawnPoints) || [];
        if (data.scenery) {
            track.scenery = data.scenery;
        }
        return track;
    };
    return TrackLoader;
}());
