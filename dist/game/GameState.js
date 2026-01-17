"use strict";
function createInitialState(track, road, playerVehicle) {
    return {
        track: track,
        road: road,
        vehicles: [playerVehicle],
        playerVehicle: playerVehicle,
        items: [],
        time: 0,
        racing: false,
        finished: false,
        cameraX: 0
    };
}
