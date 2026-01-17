"use strict";
var Collision = (function () {
    function Collision() {
    }
    Collision.aabbOverlap = function (a, b) {
        return Math.abs(a.x - b.x) < (a.halfWidth + b.halfWidth) &&
            Math.abs(a.z - b.z) < (a.halfLength + b.halfLength);
    };
    Collision.vehicleToAABB = function (v) {
        return {
            x: v.x,
            z: v.z,
            halfWidth: 4,
            halfLength: 6
        };
    };
    Collision.isOffTrack = function (vehicle, track) {
        var centerX = track.getCenterlineX(vehicle.z);
        var lateralDist = Math.abs(vehicle.x - centerX);
        return lateralDist > track.width / 2;
    };
    Collision.resolveBoundary = function (vehicle, track) {
        var centerX = track.getCenterlineX(vehicle.z);
        var halfWidth = track.width / 2;
        var lateralDist = vehicle.x - centerX;
        if (Math.abs(lateralDist) > halfWidth) {
            var dir = lateralDist > 0 ? 1 : -1;
            vehicle.x = centerX + dir * halfWidth * 0.95;
            vehicle.speed *= 0.8;
        }
    };
    Collision.processCollisions = function (vehicles, track) {
        for (var i = 0; i < vehicles.length; i++) {
            this.resolveBoundary(vehicles[i], track);
        }
    };
    return Collision;
}());
