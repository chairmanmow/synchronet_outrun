"use strict";
var CpuDriver = (function () {
    function CpuDriver(difficulty) {
        this.difficulty = clamp(difficulty, 0, 1);
    }
    CpuDriver.prototype.update = function (_vehicle, _track, _dt) {
        return {
            accelerate: 0.8 * this.difficulty,
            steer: 0,
            useItem: false
        };
    };
    return CpuDriver;
}());
