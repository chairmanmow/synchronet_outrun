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
var ItemType;
(function (ItemType) {
    ItemType[ItemType["NONE"] = 0] = "NONE";
    ItemType[ItemType["MUSHROOM"] = 1] = "MUSHROOM";
    ItemType[ItemType["SHELL"] = 2] = "SHELL";
    ItemType[ItemType["BANANA"] = 3] = "BANANA";
    ItemType[ItemType["STAR"] = 4] = "STAR";
})(ItemType || (ItemType = {}));
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.respawnTime = 10;
        _this.respawnCountdown = -1;
        return _this;
    }
    Item.prototype.isAvailable = function () {
        return this.active && this.respawnCountdown < 0;
    };
    Item.prototype.pickup = function () {
        this.respawnCountdown = this.respawnTime;
    };
    Item.prototype.updateRespawn = function (dt) {
        if (this.respawnCountdown >= 0) {
            this.respawnCountdown -= dt;
        }
    };
    return Item;
}(Entity));
