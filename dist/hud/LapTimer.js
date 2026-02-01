"use strict";
var LapTimer = (function () {
    function LapTimer() {
        this.lapTimes = [];
        this.lapStartTime = 0;
        this.raceStartTime = 0;
        this.bestLapTime = null;
    }
    LapTimer.prototype.start = function (currentTime) {
        this.raceStartTime = currentTime;
        this.lapStartTime = currentTime;
        this.lapTimes = [];
        this.bestLapTime = null;
    };
    LapTimer.prototype.completeLap = function (currentTime) {
        var lapTime = currentTime - this.lapStartTime;
        this.lapTimes.push(lapTime);
        if (this.bestLapTime === null || lapTime < this.bestLapTime) {
            this.bestLapTime = lapTime;
        }
        this.lapStartTime = currentTime;
        return lapTime;
    };
    LapTimer.prototype.getData = function (currentTime, currentLap, totalLaps) {
        return {
            currentLap: currentLap,
            totalLaps: totalLaps,
            currentLapTime: currentTime - this.lapStartTime,
            bestLapTime: this.bestLapTime,
            lapTimes: this.lapTimes.slice(),
            totalTime: currentTime - this.raceStartTime
        };
    };
    LapTimer.format = function (seconds) {
        if (seconds === null || seconds === undefined)
            return "--:--.--";
        var mins = Math.floor(seconds / 60);
        var secs = Math.floor(seconds % 60);
        var ms = Math.floor((seconds % 1) * 100);
        var secStr = secs < 10 ? "0" + secs : "" + secs;
        var msStr = ms < 10 ? "0" + ms : "" + ms;
        return mins + ":" + secStr + "." + msStr;
    };
    return LapTimer;
}());
