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
var ShellType;
(function (ShellType) {
    ShellType[ShellType["GREEN"] = 0] = "GREEN";
    ShellType[ShellType["RED"] = 1] = "RED";
    ShellType[ShellType["BLUE"] = 2] = "BLUE";
})(ShellType || (ShellType = {}));
var SHELL_PHYSICS = {
    MIN_SPEED: 300,
    GREEN_TARGET_SPEED: 400,
    RED_TARGET_SPEED: 550,
    BLUE_TARGET_SPEED: 700,
    ACCELERATION: 200,
    BACKWARD_SPEED: -250
};
var Shell = (function (_super) {
    __extends(Shell, _super);
    function Shell(shellType) {
        var _this = _super.call(this, ItemType.SHELL) || this;
        _this.shellType = shellType;
        _this.trackZ = 0;
        _this.playerX = 0;
        _this.speed = SHELL_PHYSICS.MIN_SPEED;
        _this.targetSpeed = SHELL_PHYSICS.GREEN_TARGET_SPEED;
        _this.ownerId = -1;
        _this.targetId = -1;
        _this.ttl = 10;
        _this.isDestroyed = false;
        _this.isBackward = false;
        return _this;
    }
    Shell.fireGreen = function (vehicle, backward) {
        if (backward === void 0) { backward = false; }
        var shell = new Shell(ShellType.GREEN);
        shell.ownerId = vehicle.id;
        shell.isBackward = backward;
        if (backward) {
            shell.trackZ = vehicle.trackZ - 15;
            shell.playerX = vehicle.playerX;
            shell.speed = SHELL_PHYSICS.BACKWARD_SPEED;
            shell.targetSpeed = SHELL_PHYSICS.BACKWARD_SPEED;
            logInfo("GREEN SHELL fired BACKWARD at speed=" + shell.speed.toFixed(0));
        }
        else {
            shell.trackZ = vehicle.trackZ + 15;
            shell.playerX = vehicle.playerX;
            shell.speed = SHELL_PHYSICS.MIN_SPEED;
            shell.targetSpeed = SHELL_PHYSICS.GREEN_TARGET_SPEED;
            logInfo("GREEN SHELL fired FORWARD, starting at speed=" + shell.speed.toFixed(0) + ", target=" + shell.targetSpeed);
        }
        return shell;
    };
    Shell.fireRed = function (vehicle, vehicles) {
        var shell = new Shell(ShellType.RED);
        shell.trackZ = vehicle.trackZ + 15;
        shell.playerX = vehicle.playerX;
        shell.ownerId = vehicle.id;
        shell.speed = SHELL_PHYSICS.MIN_SPEED;
        shell.targetSpeed = SHELL_PHYSICS.RED_TARGET_SPEED;
        shell.targetId = Shell.findNextVehicleAhead(vehicle, vehicles);
        logInfo("RED SHELL fired, starting at speed=" + shell.speed.toFixed(0) + ", target speed=" + shell.targetSpeed + ", homing to vehicle " + shell.targetId);
        return shell;
    };
    Shell.fireBlue = function (vehicle, vehicles) {
        var shell = new Shell(ShellType.BLUE);
        shell.trackZ = vehicle.trackZ + 15;
        shell.playerX = vehicle.playerX;
        shell.ownerId = vehicle.id;
        shell.speed = SHELL_PHYSICS.MIN_SPEED;
        shell.targetSpeed = SHELL_PHYSICS.BLUE_TARGET_SPEED;
        shell.targetId = Shell.findFirstPlace(vehicles);
        logInfo("BLUE SHELL fired, starting at speed=" + shell.speed.toFixed(0) + ", target speed=" + shell.targetSpeed + ", homing to 1st place (vehicle " + shell.targetId + ")");
        return shell;
    };
    Shell.findNextVehicleAhead = function (shooter, vehicles) {
        var bestId = -1;
        var bestDist = Infinity;
        for (var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            if (v.id === shooter.id)
                continue;
            var dist = v.trackZ - shooter.trackZ;
            if (dist > 0 && dist < bestDist) {
                bestDist = dist;
                bestId = v.id;
            }
        }
        return bestId;
    };
    Shell.findFirstPlace = function (vehicles) {
        for (var i = 0; i < vehicles.length; i++) {
            if (vehicles[i].racePosition === 1) {
                return vehicles[i].id;
            }
        }
        return -1;
    };
    Shell.prototype.update = function (dt, vehicles, roadLength) {
        if (this.isDestroyed)
            return true;
        this.ttl -= dt;
        if (this.ttl <= 0 && this.shellType !== ShellType.BLUE) {
            logInfo("Shell despawned (TTL)");
            return true;
        }
        if (!this.isBackward && this.speed < this.targetSpeed) {
            this.speed += SHELL_PHYSICS.ACCELERATION * dt;
            if (this.speed > this.targetSpeed) {
                this.speed = this.targetSpeed;
            }
        }
        this.trackZ += this.speed * dt;
        if (this.trackZ >= roadLength) {
            this.trackZ = this.trackZ % roadLength;
        }
        else if (this.trackZ < 0) {
            this.trackZ = roadLength + this.trackZ;
        }
        if (!this.isBackward && (this.shellType === ShellType.RED || this.shellType === ShellType.BLUE)) {
            var target = this.findVehicleById(vehicles, this.targetId);
            if (target) {
                var homingRate = 2.0;
                if (this.playerX < target.playerX - 0.05) {
                    this.playerX += homingRate * dt;
                }
                else if (this.playerX > target.playerX + 0.05) {
                    this.playerX -= homingRate * dt;
                }
            }
            else {
                this.shellType = ShellType.GREEN;
            }
        }
        for (var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            if (v.id === this.ownerId)
                continue;
            if (v.isCrashed)
                continue;
            var isInvincible = false;
            for (var e = 0; e < v.activeEffects.length; e++) {
                var effectType = v.activeEffects[e].type;
                if (effectType === ItemType.STAR || effectType === ItemType.BULLET) {
                    isInvincible = true;
                    break;
                }
            }
            if (isInvincible)
                continue;
            var latDist = Math.abs(this.playerX - v.playerX);
            var longDist = Math.abs(this.trackZ - v.trackZ);
            if (latDist < 0.5 && longDist < 15) {
                this.applyHitToVehicle(v);
                this.isDestroyed = true;
                return true;
            }
        }
        return false;
    };
    Shell.prototype.findVehicleById = function (vehicles, id) {
        for (var i = 0; i < vehicles.length; i++) {
            if (vehicles[i].id === id)
                return vehicles[i];
        }
        return null;
    };
    Shell.prototype.applyHitToVehicle = function (vehicle) {
        vehicle.speed = 0;
        var knockDirection = vehicle.playerX >= 0 ? 1 : -1;
        vehicle.playerX = knockDirection * (0.7 + Math.random() * 0.2);
        vehicle.flashTimer = 1.5;
        var shellNames = ['GREEN', 'RED', 'BLUE'];
        var direction = this.isBackward ? ' (backward)' : '';
        logInfo(shellNames[this.shellType] + " SHELL" + direction + " hit vehicle " + vehicle.id + " - knocked to edge at playerX=" + vehicle.playerX.toFixed(2) + "!");
    };
    return Shell;
}(Item));
