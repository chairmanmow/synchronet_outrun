"use strict";
var CheckpointTracker = (function () {
    function CheckpointTracker(track) {
        this.track = track;
        this.vehicleCheckpoints = {};
    }
    CheckpointTracker.prototype.initVehicle = function (vehicleId) {
        this.vehicleCheckpoints[vehicleId] = 0;
    };
    CheckpointTracker.prototype.checkProgress = function (vehicle) {
        var currentCheckpoint = this.vehicleCheckpoints[vehicle.id] || 0;
        var nextCheckpoint = this.track.checkpoints[currentCheckpoint];
        if (!nextCheckpoint) {
            return false;
        }
        var wrappedZ = vehicle.z % this.track.length;
        if (wrappedZ >= nextCheckpoint.z) {
            this.vehicleCheckpoints[vehicle.id] = currentCheckpoint + 1;
            vehicle.checkpoint = currentCheckpoint + 1;
            if (currentCheckpoint + 1 >= this.track.checkpoints.length) {
                this.vehicleCheckpoints[vehicle.id] = 0;
                return true;
            }
        }
        return false;
    };
    CheckpointTracker.prototype.getCurrentCheckpoint = function (vehicleId) {
        return this.vehicleCheckpoints[vehicleId] || 0;
    };
    CheckpointTracker.prototype.reset = function () {
        this.vehicleCheckpoints = {};
    };
    return CheckpointTracker;
}());
