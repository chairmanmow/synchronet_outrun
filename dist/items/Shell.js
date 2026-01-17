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
var Shell = (function (_super) {
    __extends(Shell, _super);
    function Shell() {
        var _this = _super.call(this, ItemType.SHELL) || this;
        _this.speed = 300;
        _this.ownerId = -1;
        return _this;
    }
    Shell.fire = function (vehicle) {
        var shell = new Shell();
        shell.x = vehicle.x;
        shell.z = vehicle.z + 12;
        shell.rotation = vehicle.rotation;
        shell.ownerId = vehicle.id;
        shell.speed = 300;
        return shell;
    };
    Shell.prototype.updatePosition = function (dt) {
        this.z += this.speed * dt;
    };
    Shell.applyHit = function (vehicle) {
        vehicle.speed = 0;
    };
    return Shell;
}(Item));
