"use strict";
var Hud = (function () {
    function Hud() {
        this.startTime = 0;
        this.lapStartTime = 0;
        this.bestLapTime = Infinity;
    }
    Hud.prototype.init = function (currentTime) {
        this.startTime = currentTime;
        this.lapStartTime = currentTime;
        this.bestLapTime = Infinity;
    };
    Hud.prototype.onLapComplete = function (currentTime) {
        var lapTime = currentTime - this.lapStartTime;
        if (lapTime < this.bestLapTime) {
            this.bestLapTime = lapTime;
        }
        this.lapStartTime = currentTime;
    };
    Hud.prototype.compute = function (vehicle, track, road, vehicles, currentTime, countdown, raceMode) {
        var lapProgress = 0;
        if (road.totalLength > 0) {
            lapProgress = (vehicle.trackZ % road.totalLength) / road.totalLength;
            if (lapProgress < 0)
                lapProgress += 1.0;
        }
        var racers = vehicles.filter(function (v) { return !v.isNPC || v.isRacer; });
        var isCountdown = (countdown !== undefined && countdown > 0);
        var lapTime = currentTime - this.lapStartTime;
        var totalTime = currentTime - this.startTime;
        var displayLapTime = isCountdown ? 0 : Math.max(0, lapTime);
        var displayTotalTime = isCountdown ? 0 : Math.max(0, totalTime);
        return {
            speed: Math.round(vehicle.speed),
            speedMax: VEHICLE_PHYSICS.MAX_SPEED,
            lap: vehicle.lap,
            totalLaps: track.laps,
            lapProgress: lapProgress,
            position: vehicle.racePosition,
            totalRacers: racers.length,
            lapTime: displayLapTime,
            bestLapTime: this.bestLapTime === Infinity ? 0 : this.bestLapTime,
            totalTime: displayTotalTime,
            heldItem: vehicle.heldItem,
            raceFinished: vehicle.lap > track.laps,
            countdown: countdown || 0,
            raceMode: raceMode !== undefined ? raceMode : RaceMode.TIME_TRIAL
        };
    };
    Hud.formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        var secStr = secs < 10 ? "0" + secs.toFixed(2) : secs.toFixed(2);
        return mins + ":" + secStr;
    };
    return Hud;
}());
