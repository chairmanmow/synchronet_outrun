"use strict";
var PositionIndicator = (function () {
    function PositionIndicator() {
    }
    PositionIndicator.calculate = function (position, totalRacers) {
        return {
            position: position,
            totalRacers: totalRacers,
            suffix: this.getOrdinalSuffix(position)
        };
    };
    PositionIndicator.getOrdinalSuffix = function (n) {
        var s = ["th", "st", "nd", "rd"];
        var v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };
    PositionIndicator.format = function (data) {
        return data.position + data.suffix + " / " + data.totalRacers;
    };
    PositionIndicator.calculatePositions = function (vehicles) {
        var racers = vehicles.filter(function (v) { return !v.isNPC || v.isRacer; });
        var VISUAL_OFFSET = 200;
        var sorted = racers.slice().sort(function (a, b) {
            if (a.lap !== b.lap)
                return b.lap - a.lap;
            var aZ = a.trackZ + (a.isNPC ? 0 : VISUAL_OFFSET);
            var bZ = b.trackZ + (b.isNPC ? 0 : VISUAL_OFFSET);
            return bZ - aZ;
        });
        for (var i = 0; i < sorted.length; i++) {
            sorted[i].racePosition = i + 1;
        }
    };
    return PositionIndicator;
}());
