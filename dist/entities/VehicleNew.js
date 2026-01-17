"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var VEHICLE_PHYSICS = {
    MAX_SPEED: 15000,
    ACCEL: 5000,
    BRAKE: 10000,
    DECEL: 1000,
    OFFROAD_DECEL: 8000,
    STEER_RATE: 3.0,
    STEER_SPEED_FACTOR: 0.5,
    CENTRIFUGAL: 0.3,
    ROAD_HALF_WIDTH: 1.0,
    OFFROAD_LIMIT: 2.0,
    CRASH_TIME: 2.0,
};
var Vehicle = (function (_super) {
    __extends(Vehicle, _super);
    function Vehicle() {
        var _this = _super.call(this) || this;
        _this.vx = 0;
        _this.vz = 0;
        _this.speed = 0;
        _this.playerX = 0;
        _this.trackZ = 0;
        _this.x = 0;
        _this.z = 0;
        _this.driver = null;
        _this.lap = 1;
        _this.checkpoint = 0;
        _this.racePosition = 1;
        _this.heldItem = null;
        _this.color = YELLOW;
        _this.isOffRoad = false;
        _this.isCrashed = false;
        _this.crashTimer = 0;
        return _this;
    }
    Vehicle.prototype.update = function (road, intent, dt) {
        if (this.isCrashed) {
            this.crashTimer -= dt;
            if (this.crashTimer <= 0) {
                this.isCrashed = false;
                this.crashTimer = 0;
                this.playerX = 0;
            }
            return;
        }
        if (intent.accelerate > 0) {
            this.speed += VEHICLE_PHYSICS.ACCEL * dt;
        }
        else if (intent.accelerate < 0) {
            this.speed -= VEHICLE_PHYSICS.BRAKE * dt;
        }
        else {
            this.speed -= VEHICLE_PHYSICS.DECEL * dt;
        }
        this.isOffRoad = Math.abs(this.playerX) > VEHICLE_PHYSICS.ROAD_HALF_WIDTH;
        if (this.isOffRoad) {
            this.speed -= VEHICLE_PHYSICS.OFFROAD_DECEL * dt;
        }
        this.speed = clamp(this.speed, 0, VEHICLE_PHYSICS.MAX_SPEED);
        var speedRatio = this.speed / VEHICLE_PHYSICS.MAX_SPEED;
        var steerMultiplier = 1.0 - (speedRatio * VEHICLE_PHYSICS.STEER_SPEED_FACTOR);
        var steerAmount = intent.steer * VEHICLE_PHYSICS.STEER_RATE * steerMultiplier * dt;
        this.playerX += steerAmount;
        var curvature = road.getCurvature(this.trackZ);
        var centrifugal = curvature * speedRatio * VEHICLE_PHYSICS.CENTRIFUGAL * dt;
        this.playerX += centrifugal;
        if (Math.abs(this.playerX) > VEHICLE_PHYSICS.OFFROAD_LIMIT) {
            this.triggerCrash();
            return;
        }
        this.trackZ += this.speed * dt;
        this.z = this.trackZ;
        this.x = this.playerX * 20;
    };
    Vehicle.prototype.triggerCrash = function () {
        this.isCrashed = true;
        this.crashTimer = VEHICLE_PHYSICS.CRASH_TIME;
        this.speed = 0;
        logInfo("CRASH! Recovering...");
    };
    Vehicle.prototype.applyIntent = function (intent, dt) {
    };
    Vehicle.prototype.checkRoadBounds = function (_roadWidth, _centerX) {
    };
    return Vehicle;
}(Entity));
