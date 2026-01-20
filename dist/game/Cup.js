"use strict";
var CUP_POINTS = [15, 12, 10, 8, 6, 5, 4, 3, 2, 1];
function getPointsForPosition(position) {
    if (position < 1 || position > CUP_POINTS.length)
        return 0;
    return CUP_POINTS[position - 1];
}
var CupManager = (function () {
    function CupManager() {
        this.state = null;
    }
    CupManager.prototype.startCup = function (cupDef, racerNames) {
        var standings = [];
        standings.push({
            id: 1,
            name: 'YOU',
            isPlayer: true,
            points: 0,
            raceResults: []
        });
        for (var i = 0; i < racerNames.length; i++) {
            standings.push({
                id: i + 2,
                name: racerNames[i],
                isPlayer: false,
                points: 0,
                raceResults: []
            });
        }
        this.state = {
            definition: cupDef,
            currentRaceIndex: 0,
            standings: standings,
            raceResults: [],
            totalTime: 0,
            totalBestLaps: 0,
            isComplete: false
        };
    };
    CupManager.prototype.getState = function () {
        return this.state;
    };
    CupManager.prototype.getCurrentTrackId = function () {
        if (!this.state)
            return null;
        if (this.state.currentRaceIndex >= this.state.definition.trackIds.length)
            return null;
        return this.state.definition.trackIds[this.state.currentRaceIndex];
    };
    CupManager.prototype.getCurrentRaceNumber = function () {
        if (!this.state)
            return 0;
        return this.state.currentRaceIndex + 1;
    };
    CupManager.prototype.getTotalRaces = function () {
        if (!this.state)
            return 0;
        return this.state.definition.trackIds.length;
    };
    CupManager.prototype.recordRaceResult = function (trackId, trackName, racerPositions, playerTime, playerBestLap) {
        if (!this.state)
            return;
        var positions = {};
        for (var i = 0; i < racerPositions.length; i++) {
            var rp = racerPositions[i];
            positions[rp.id] = rp.position;
        }
        var result = {
            trackId: trackId,
            trackName: trackName,
            positions: positions,
            playerTime: playerTime,
            playerBestLap: playerBestLap
        };
        this.state.raceResults.push(result);
        for (var j = 0; j < this.state.standings.length; j++) {
            var standing = this.state.standings[j];
            var position = positions[standing.id] || 8;
            standing.raceResults.push(position);
            standing.points += getPointsForPosition(position);
        }
        this.state.totalTime += playerTime;
        this.state.totalBestLaps += playerBestLap;
        this.state.standings.sort(function (a, b) {
            return b.points - a.points;
        });
        this.state.currentRaceIndex++;
        if (this.state.currentRaceIndex >= this.state.definition.trackIds.length) {
            this.state.isComplete = true;
        }
    };
    CupManager.prototype.getStandings = function () {
        if (!this.state)
            return [];
        return this.state.standings.slice();
    };
    CupManager.prototype.getPlayerCupPosition = function () {
        if (!this.state)
            return 0;
        for (var i = 0; i < this.state.standings.length; i++) {
            if (this.state.standings[i].isPlayer) {
                return i + 1;
            }
        }
        return 0;
    };
    CupManager.prototype.isCupComplete = function () {
        return this.state ? this.state.isComplete : false;
    };
    CupManager.prototype.didPlayerWin = function () {
        if (!this.state || !this.state.isComplete)
            return false;
        return this.state.standings[0].isPlayer;
    };
    CupManager.prototype.getPlayerPoints = function () {
        if (!this.state)
            return 0;
        for (var i = 0; i < this.state.standings.length; i++) {
            if (this.state.standings[i].isPlayer) {
                return this.state.standings[i].points;
            }
        }
        return 0;
    };
    CupManager.prototype.clear = function () {
        this.state = null;
    };
    CupManager.CUPS = [
        {
            id: 'neon_cup',
            name: 'Neon Cup',
            trackIds: ['neon_coast', 'twilight_forest', 'sunset_beach'],
            description: 'A tour through the neon-lit night'
        },
        {
            id: 'nature_cup',
            name: 'Nature Cup',
            trackIds: ['twilight_forest', 'sunset_beach', 'cactus_canyon', 'tropical_jungle'],
            description: 'Race through nature\'s finest'
        },
        {
            id: 'spooky_cup',
            name: 'Spooky Cup',
            trackIds: ['haunted_hollow', 'dark_castle', 'ancient_ruins'],
            description: 'Face your fears on the track'
        },
        {
            id: 'fantasy_cup',
            name: 'Fantasy Cup',
            trackIds: ['candy_land', 'rainbow_road', 'dark_castle', 'kaiju_rampage'],
            description: 'A journey through imagination'
        },
        {
            id: 'grand_prix',
            name: 'Grand Prix',
            trackIds: ['neon_coast', 'sunset_beach', 'twilight_forest', 'haunted_hollow',
                'cactus_canyon', 'tropical_jungle', 'rainbow_road', 'thunder_stadium'],
            description: 'The ultimate challenge - 8 tracks!'
        }
    ];
    return CupManager;
}());
