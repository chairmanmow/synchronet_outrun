"use strict";
var HumanDriver = (function () {
    function HumanDriver(controls) {
        this.controls = controls;
    }
    HumanDriver.prototype.update = function (_vehicle, _track, _dt) {
        return {
            accelerate: this.controls.getAcceleration(),
            steer: this.controls.getSteering(),
            useItem: this.controls.wasJustPressed(GameAction.USE_ITEM)
        };
    };
    return HumanDriver;
}());
