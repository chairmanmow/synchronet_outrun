"use strict";
var Speedometer = (function () {
    function Speedometer(maxBarLength) {
        this.maxBarLength = maxBarLength;
    }
    Speedometer.prototype.calculate = function (currentSpeed, maxSpeed) {
        var percentage = clamp(currentSpeed / maxSpeed, 0, 1);
        var filledLength = Math.round(percentage * this.maxBarLength);
        return {
            currentSpeed: Math.round(currentSpeed),
            maxSpeed: maxSpeed,
            percentage: percentage,
            barLength: this.maxBarLength,
            filledLength: filledLength
        };
    };
    Speedometer.prototype.generateBar = function (data) {
        var filled = '';
        var empty = '';
        for (var i = 0; i < data.filledLength; i++) {
            filled += '█';
        }
        for (var j = data.filledLength; j < data.barLength; j++) {
            empty += '░';
        }
        return filled + empty;
    };
    return Speedometer;
}());
