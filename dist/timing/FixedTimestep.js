"use strict";
var FixedTimestep = (function () {
    function FixedTimestep(config) {
        this.tickDuration = 1000 / config.tickRate;
        this.maxTicks = config.maxTicksPerFrame;
        this.accumulator = 0;
    }
    FixedTimestep.prototype.update = function (deltaMs) {
        this.accumulator += deltaMs;
        var ticks = 0;
        while (this.accumulator >= this.tickDuration && ticks < this.maxTicks) {
            this.accumulator -= this.tickDuration;
            ticks++;
        }
        if (ticks >= this.maxTicks) {
            this.accumulator = 0;
        }
        return ticks;
    };
    FixedTimestep.prototype.getAlpha = function () {
        return this.accumulator / this.tickDuration;
    };
    FixedTimestep.prototype.getDt = function () {
        return this.tickDuration / 1000;
    };
    FixedTimestep.prototype.reset = function () {
        this.accumulator = 0;
    };
    return FixedTimestep;
}());
