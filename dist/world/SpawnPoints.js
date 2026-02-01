"use strict";
var SpawnPointManager = (function () {
    function SpawnPointManager(track) {
        this.track = track;
    }
    SpawnPointManager.prototype.getSpawnPosition = function (gridPosition) {
        if (gridPosition < this.track.spawnPoints.length) {
            var sp = this.track.spawnPoints[gridPosition];
            return { x: sp.x, z: sp.z };
        }
        var row = Math.floor(gridPosition / 2);
        var col = gridPosition % 2;
        return {
            x: col === 0 ? -5 : 5,
            z: -(row + 1) * 15
        };
    };
    SpawnPointManager.prototype.placeVehicle = function (vehicle, gridPosition) {
        var pos = this.getSpawnPosition(gridPosition);
        vehicle.x = pos.x;
        vehicle.z = pos.z;
        vehicle.rotation = 0;
        vehicle.speed = 0;
    };
    SpawnPointManager.prototype.placeVehicles = function (vehicles) {
        for (var i = 0; i < vehicles.length; i++) {
            this.placeVehicle(vehicles[i], i);
        }
    };
    return SpawnPointManager;
}());
