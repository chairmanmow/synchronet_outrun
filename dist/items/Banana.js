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
var Banana = (function (_super) {
    __extends(Banana, _super);
    function Banana() {
        var _this = _super.call(this, ItemType.BANANA) || this;
        _this.shellType = ShellType.GREEN;
        _this.trackZ = 0;
        _this.playerX = 0;
        _this.speed = 0;
        _this.ownerId = -1;
        _this.targetId = -1;
        _this.ttl = 60;
        _this.isDestroyed = false;
        return _this;
    }
    Banana.drop = function (vehicle) {
        var banana = new Banana();
        banana.trackZ = vehicle.trackZ - 20;
        banana.playerX = vehicle.playerX;
        banana.ownerId = vehicle.id;
        logInfo("BANANA dropped at trackZ=" + banana.trackZ.toFixed(0) + ", playerX=" + banana.playerX.toFixed(2));
        return banana;
    };
    Banana.prototype.update = function (dt, vehicles, roadLength) {
        if (this.isDestroyed)
            return true;
        this.ttl -= dt;
        if (this.ttl <= 0) {
            logInfo("Banana despawned (TTL)");
            return true;
        }
        if (this.trackZ < 0) {
            this.trackZ += roadLength;
        }
        else if (this.trackZ >= roadLength) {
            this.trackZ = this.trackZ % roadLength;
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
    Banana.prototype.applyHitToVehicle = function (vehicle) {
        vehicle.speed = 0;
        var knockDirection = vehicle.playerX >= 0 ? 1 : -1;
        vehicle.playerX = knockDirection * (0.7 + Math.random() * 0.2);
        vehicle.flashTimer = 2.0;
        logInfo("BANANA hit vehicle " + vehicle.id + " - spun out to edge at playerX=" + vehicle.playerX.toFixed(2) + "!");
    };
    return Banana;
}(Item));
