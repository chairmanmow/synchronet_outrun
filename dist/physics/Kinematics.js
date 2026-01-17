"use strict";
var Kinematics = (function () {
    function Kinematics() {
    }
    Kinematics.update = function (entity, dt) {
        entity.x += Math.sin(entity.rotation) * entity.speed * dt;
        entity.z += Math.cos(entity.rotation) * entity.speed * dt;
    };
    Kinematics.applyFriction = function (entity, friction, dt) {
        if (entity.speed > 0) {
            entity.speed = Math.max(0, entity.speed - friction * dt);
        }
    };
    Kinematics.applyAcceleration = function (entity, accel, maxSpeed, dt) {
        entity.speed += accel * dt;
        entity.speed = clamp(entity.speed, 0, maxSpeed);
    };
    return Kinematics;
}());
