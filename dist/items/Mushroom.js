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
        var _this = _super.call(this, ItemType.MUSHROOM) || this;
        _this.boostMultiplier = 1.5;
        _this.boostDuration = 2.0;
        return _this;
    }
    Mushroom.applyEffect = function (vehicle) {
        vehicle.speed = Math.min(vehicle.speed * 1.5, VEHICLE_PHYSICS.MAX_SPEED * 1.3);
    };
    return Mushroom;
}(Item));
