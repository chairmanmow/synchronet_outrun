"use strict";
var HumanDriver = (function () {
    function HumanDriver(controls) {
        this.controls = controls;
        this.canMove = true;
    }
    HumanDriver.prototype.setCanMove = function (canMove) {
        this.canMove = canMove;
    };
    HumanDriver.prototype.update = function (_vehicle, _track, _dt) {
        if (!this.canMove) {
            return {
                accelerate: 0,
                steer: 0,
                useItem: false
            };
        }
        return {
            accelerate: this.controls.getAcceleration(),
            steer: this.controls.getSteering(),
            useItem: this.controls.wasJustPressed(GameAction.USE_ITEM)
        };
    };
    return HumanDriver;
}());
