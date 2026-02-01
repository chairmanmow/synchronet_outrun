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
var Mushroom = (function (_super) {
    __extends(Mushroom, _super);
    function Mushroom() {
        return _super.call(this, ItemType.MUSHROOM) || this;
    }
    Mushroom.applyEffect = function (vehicle) {
        vehicle.boostTimer = Mushroom.BOOST_DURATION;
        vehicle.boostMultiplier = Mushroom.BOOST_MULTIPLIER;
        vehicle.boostMinSpeed = Math.max(vehicle.speed, VEHICLE_PHYSICS.MAX_SPEED * 0.5);
        vehicle.speed = Math.min(vehicle.speed * 1.3, VEHICLE_PHYSICS.MAX_SPEED * Mushroom.BOOST_MULTIPLIER);
        logInfo("Mushroom boost activated! Duration: " + Mushroom.BOOST_DURATION + "s, minSpeed: " + vehicle.boostMinSpeed);
    };
    Mushroom.BOOST_MULTIPLIER = 1.4;
    Mushroom.BOOST_DURATION = 3.0;
    return Mushroom;
}(Item));
