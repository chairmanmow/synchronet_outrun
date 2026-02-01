"use strict";
var Steering = (function () {
    function Steering() {
    }
    Steering.apply = function (vehicle, input, steerSpeed, dt) {
        if (Math.abs(input) < 0.01)
            return;
        if (vehicle.speed < 1)
            return;
        var speedFactor = 1 - (vehicle.speed / VEHICLE_PHYSICS.MAX_SPEED) * 0.5;
        var steerAmount = input * steerSpeed * speedFactor * dt;
        vehicle.rotation += steerAmount;
        vehicle.rotation = wrapAngle(vehicle.rotation);
    };
    Steering.applyLateral = function (vehicle, input, lateralSpeed, dt) {
        if (Math.abs(input) < 0.01)
            return;
        if (vehicle.speed < 1)
            return;
        var speedFactor = vehicle.speed / VEHICLE_PHYSICS.MAX_SPEED;
        vehicle.x += input * lateralSpeed * speedFactor * dt;
    };
    return Steering;
}());
