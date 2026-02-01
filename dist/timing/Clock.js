"use strict";
var Clock = (function () {
    function Clock() {
        this.lastTime = this.now();
    }
    Clock.prototype.now = function () {
        return system.timer * 1000;
    };
    Clock.prototype.getDelta = function () {
        var currentTime = this.now();
        var delta = currentTime - this.lastTime;
        this.lastTime = currentTime;
        if (delta > 250) {
            delta = 250;
        }
        return delta;
    };
    Clock.prototype.reset = function () {
        this.lastTime = this.now();
    };
    return Clock;
}());
