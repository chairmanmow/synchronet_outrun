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
    MAX_SPEED: 300,
    ACCEL: 150,
    BRAKE: 250,
    DECEL: 20,
    OFFROAD_DECEL: 200,
    STEER_RATE: 2.0,
    STEER_SPEED_FACTOR: 0.3,
    CENTRIFUGAL: 0.6,
    ROAD_HALF_WIDTH: 1.0,
    OFFROAD_LIMIT: 1.8,
    CRASH_TIME: 1.5,
};
var Vehicle = (function (_super) {
    __extends(Vehicle, _super);
    function Vehicle() {
        var _this = _super.call(this) || this;
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
        _this.activeEffects = [];
        _this.color = YELLOW;
        _this.isOffRoad = false;
        _this.isCrashed = false;
        _this.crashTimer = 0;
        _this.flashTimer = 0;
        _this.boostTimer = 0;
        _this.boostMultiplier = 1.0;
        _this.boostMinSpeed = 0;
        _this.isNPC = false;
        _this.isRacer = false;
        _this.npcType = 'sedan';
        _this.npcColorIndex = 0;
        return _this;
    }
    Vehicle.prototype.hasEffect = function (type) {
        for (var i = 0; i < this.activeEffects.length; i++) {
            if (this.activeEffects[i].type === type)
                return true;
        }
        return false;
    };
    Vehicle.prototype.addEffect = function (type, duration, sourceId) {
        this.removeEffect(type);
        this.activeEffects.push({ type: type, duration: duration, sourceVehicleId: sourceId });
    };
    Vehicle.prototype.removeEffect = function (type) {
        for (var i = this.activeEffects.length - 1; i >= 0; i--) {
            if (this.activeEffects[i].type === type) {
                this.activeEffects.splice(i, 1);
            }
        }
    };
    Vehicle.prototype.updateEffects = function (dt) {
        for (var i = this.activeEffects.length - 1; i >= 0; i--) {
            this.activeEffects[i].duration -= dt;
            if (this.activeEffects[i].duration <= 0) {
                var expiredType = this.activeEffects[i].type;
                this.activeEffects.splice(i, 1);
                this.onEffectExpired(expiredType);
            }
        }
    };
    Vehicle.prototype.onEffectExpired = function (type) {
        switch (type) {
            case ItemType.STAR:
                this.boostTimer = 0;
                this.boostMultiplier = 1.0;
                this.boostMinSpeed = 0;
                logInfo("Star effect expired");
                break;
            case ItemType.MUSHROOM_GOLDEN:
            case ItemType.BULLET:
                this.boostTimer = 0;
                this.boostMultiplier = 1.0;
                this.boostMinSpeed = 0;
                if (this.heldItem !== null && this.heldItem.type === type) {
                    this.heldItem = null;
                    logInfo(ItemType[type] + " effect expired - item cleared from slot");
                }
                break;
            case ItemType.LIGHTNING:
                logInfo("Lightning effect expired");
                break;
        }
    };
    Vehicle.prototype.updatePhysics = function (road, intent, dt) {
        this.updateEffects(dt);
        if (this.flashTimer > 0) {
            this.flashTimer -= dt;
            if (this.flashTimer < 0)
                this.flashTimer = 0;
        }
        if (this.boostTimer > 0) {
            this.boostTimer -= dt;
            if (this.boostTimer <= 0) {
                this.boostTimer = 0;
                if (!this.hasEffect(ItemType.STAR) &&
                    !this.hasEffect(ItemType.BULLET) &&
                    !this.hasEffect(ItemType.MUSHROOM_GOLDEN)) {
                    this.boostMultiplier = 1.0;
                    this.boostMinSpeed = 0;
                }
            }
        }
        var lightningSlowdown = this.hasEffect(ItemType.LIGHTNING) ? 0.5 : 1.0;
        if (this.isCrashed) {
            this.crashTimer -= dt;
            if (this.crashTimer <= 0) {
                this.isCrashed = false;
                this.crashTimer = 0;
                this.playerX = 0;
                this.flashTimer = 0.5;
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
            if (this.flashTimer <= 0) {
                this.flashTimer = 0.15;
            }
            if (this.speed < 10) {
                this.speed = 0;
                this.playerX = 0;
                this.isOffRoad = false;
                this.flashTimer = 0.5;
            }
        }
        var effectiveMaxSpeed = VEHICLE_PHYSICS.MAX_SPEED * this.boostMultiplier * lightningSlowdown;
        var minSpeed = this.boostMinSpeed > 0 ? this.boostMinSpeed : 0;
        this.speed = clamp(this.speed, minSpeed, effectiveMaxSpeed);
        var speedRatio = this.speed / VEHICLE_PHYSICS.MAX_SPEED;
        var hasBullet = this.hasEffect(ItemType.BULLET);
        if (hasBullet) {
            var autoPilotRate = 3.0;
            if (this.playerX < -0.05) {
                this.playerX += autoPilotRate * dt;
                if (this.playerX > 0)
                    this.playerX = 0;
            }
            else if (this.playerX > 0.05) {
                this.playerX -= autoPilotRate * dt;
                if (this.playerX < 0)
                    this.playerX = 0;
            }
        }
        else {
            if (this.speed >= 5) {
                var steerMult = 1.0 - (speedRatio * VEHICLE_PHYSICS.STEER_SPEED_FACTOR);
                var steerDelta = intent.steer * VEHICLE_PHYSICS.STEER_RATE * steerMult * dt;
                this.playerX += steerDelta;
            }
            var curve = road.getCurvature(this.trackZ);
            var centrifugal = curve * speedRatio * VEHICLE_PHYSICS.CENTRIFUGAL * dt;
            this.playerX += centrifugal;
        }
        var isInvincible = this.hasEffect(ItemType.STAR) || hasBullet;
        if (Math.abs(this.playerX) > VEHICLE_PHYSICS.OFFROAD_LIMIT && !isInvincible) {
            this.triggerCrash();
            return;
        }
        if (isInvincible && Math.abs(this.playerX) > VEHICLE_PHYSICS.ROAD_HALF_WIDTH) {
            this.playerX = clamp(this.playerX, -VEHICLE_PHYSICS.ROAD_HALF_WIDTH, VEHICLE_PHYSICS.ROAD_HALF_WIDTH);
        }
        this.trackZ += this.speed * dt;
        if (this.trackZ >= road.totalLength) {
            this.trackZ = this.trackZ % road.totalLength;
        }
        this.z = this.trackZ;
        this.x = this.playerX * 20;
    };
    Vehicle.prototype.triggerCrash = function () {
        debugLog.warn("CRASH! playerX=" + this.playerX.toFixed(3) + " (limit=" + VEHICLE_PHYSICS.OFFROAD_LIMIT + ")");
        debugLog.info("  trackZ=" + this.trackZ.toFixed(1) + " speed=" + this.speed.toFixed(1));
        debugLog.info("  Entering recovery for " + VEHICLE_PHYSICS.CRASH_TIME + " seconds");
        this.isCrashed = true;
        this.crashTimer = VEHICLE_PHYSICS.CRASH_TIME;
        this.speed = 0;
    };
    return Vehicle;
}(Entity));
