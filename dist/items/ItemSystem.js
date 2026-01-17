"use strict";
var ItemSystem = (function () {
    function ItemSystem() {
        this.items = [];
        this.projectiles = [];
    }
    ItemSystem.prototype.initFromTrack = function (_track) {
        var itemPositions = [
            { x: 0, z: 150, respawnTime: 10 },
            { x: 0, z: 450, respawnTime: 10 },
            { x: -10, z: 750, respawnTime: 10 },
            { x: 10, z: 750, respawnTime: 10 },
            { x: 0, z: 1050, respawnTime: 10 }
        ];
        for (var i = 0; i < itemPositions.length; i++) {
            var pos = itemPositions[i];
            var item = new Item(ItemType.NONE);
            item.x = pos.x;
            item.z = pos.z;
            item.respawnTime = pos.respawnTime;
            this.items.push(item);
        }
    };
    ItemSystem.prototype.update = function (dt) {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].updateRespawn(dt);
        }
        for (var j = this.projectiles.length - 1; j >= 0; j--) {
            var proj = this.projectiles[j];
            proj.z += proj.speed * dt;
            if (proj.z > 10000) {
                this.projectiles.splice(j, 1);
            }
        }
    };
    ItemSystem.prototype.checkPickups = function (vehicles) {
        for (var i = 0; i < vehicles.length; i++) {
            var vehicle = vehicles[i];
            if (vehicle.heldItem !== null)
                continue;
            for (var j = 0; j < this.items.length; j++) {
                var item = this.items[j];
                if (!item.isAvailable())
                    continue;
                var dx = vehicle.x - item.x;
                var dz = vehicle.z - item.z;
                if (Math.abs(dx) < 10 && Math.abs(dz) < 10) {
                    item.pickup();
                    vehicle.heldItem = this.randomItemType();
                    logInfo("Vehicle " + vehicle.id + " picked up item: " + vehicle.heldItem);
                }
            }
        }
    };
    ItemSystem.prototype.useItem = function (vehicle) {
        if (vehicle.heldItem === null)
            return;
        switch (vehicle.heldItem) {
            case ItemType.MUSHROOM:
                Mushroom.applyEffect(vehicle);
                break;
            case ItemType.SHELL:
                var shell = Shell.fire(vehicle);
                this.projectiles.push(shell);
                break;
        }
        vehicle.heldItem = null;
    };
    ItemSystem.prototype.randomItemType = function () {
        var roll = globalRand.next();
        if (roll < 0.5)
            return ItemType.MUSHROOM;
        if (roll < 0.8)
            return ItemType.SHELL;
        return ItemType.BANANA;
    };
    ItemSystem.prototype.getItemBoxes = function () {
        return this.items;
    };
    ItemSystem.prototype.getProjectiles = function () {
        return this.projectiles;
    };
    return ItemSystem;
}());
