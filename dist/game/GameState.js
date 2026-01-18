"use strict";
var RaceMode;
(function (RaceMode) {
    RaceMode["TIME_TRIAL"] = "time_trial";
    RaceMode["GRAND_PRIX"] = "grand_prix";
})(RaceMode || (RaceMode = {}));
function createInitialState(track, road, playerVehicle, raceMode) {
    return {
        track: track,
        road: road,
        vehicles: [playerVehicle],
        playerVehicle: playerVehicle,
        items: [],
        time: 0,
        racing: false,
        finished: false,
        cameraX: 0,
        raceMode: raceMode || RaceMode.TIME_TRIAL,
        lapStartTime: 0,
        bestLapTime: -1,
        lapTimes: [],
        raceResults: [],
        countdown: 3,
        raceStarted: false
    };
}
