"use strict";
if (typeof JSONdb === 'undefined') {
    load('json-db.js');
}
var HighScoreType;
(function (HighScoreType) {
    HighScoreType["TRACK_TIME"] = "track_time";
    HighScoreType["LAP_TIME"] = "lap_time";
    HighScoreType["CIRCUIT_TIME"] = "circuit_time";
})(HighScoreType || (HighScoreType = {}));
var HighScoreManager = (function () {
    function HighScoreManager() {
        this.maxEntries = 10;
        this.dbPath = js.exec_dir + 'highscores.json';
        try {
            this.db = new JSONdb(this.dbPath, 'OUTRUN_SCORES');
            this.db.settings.KEEP_READABLE = true;
            this.db.load();
        }
        catch (e) {
            logError("Failed to initialize high score database: " + e);
            this.db = null;
        }
    }
    HighScoreManager.prototype.getKey = function (type, identifier) {
        var sanitized = identifier.replace(/\s+/g, '_').toLowerCase();
        return type + '.' + sanitized;
    };
    HighScoreManager.prototype.getScores = function (type, identifier) {
        if (!this.db)
            return [];
        try {
            this.db.load();
            var key = this.getKey(type, identifier);
            var data = this.db.masterData.data || {};
            var scores = data[key];
            if (scores && Array.isArray(scores)) {
                return scores;
            }
            return [];
        }
        catch (e) {
            logError("Failed to get high scores: " + e);
            return [];
        }
    };
    HighScoreManager.prototype.getTopScore = function (type, identifier) {
        var scores = this.getScores(type, identifier);
        if (scores.length > 0) {
            return scores[0];
        }
        return null;
    };
    HighScoreManager.prototype.checkQualification = function (type, identifier, time) {
        var scores = this.getScores(type, identifier);
        if (scores.length < this.maxEntries) {
            for (var i = 0; i < scores.length; i++) {
                if (time < scores[i].time) {
                    return i + 1;
                }
            }
            return scores.length + 1;
        }
        for (var i = 0; i < scores.length; i++) {
            if (time < scores[i].time) {
                return i + 1;
            }
        }
        return 0;
    };
    HighScoreManager.prototype.submitScore = function (type, identifier, playerName, time, trackName, circuitName) {
        if (!this.db)
            return 0;
        try {
            this.db.load();
            var key = this.getKey(type, identifier);
            var scores = this.getScores(type, identifier);
            var entry = {
                playerName: playerName,
                time: time,
                date: Date.now()
            };
            if (trackName)
                entry.trackName = trackName;
            if (circuitName)
                entry.circuitName = circuitName;
            var position = 0;
            for (var i = 0; i < scores.length; i++) {
                if (time < scores[i].time) {
                    position = i;
                    break;
                }
            }
            if (position === 0 && scores.length < this.maxEntries) {
                position = scores.length;
            }
            if (position === 0 && scores.length >= this.maxEntries) {
                return 0;
            }
            scores.splice(position, 0, entry);
            if (scores.length > this.maxEntries) {
                scores = scores.slice(0, this.maxEntries);
            }
            var data = this.db.masterData.data || {};
            data[key] = scores;
            this.db.masterData.data = data;
            this.db.save();
            return position + 1;
        }
        catch (e) {
            logError("Failed to submit high score: " + e);
            return 0;
        }
    };
    HighScoreManager.prototype.clearAll = function () {
        if (!this.db)
            return;
        try {
            this.db.masterData.data = {};
            this.db.save();
        }
        catch (e) {
            logError("Failed to clear high scores: " + e);
        }
    };
    HighScoreManager.prototype.clear = function (type, identifier) {
        if (!this.db)
            return;
        try {
            this.db.load();
            var key = this.getKey(type, identifier);
            var data = this.db.masterData.data || {};
            delete data[key];
            this.db.masterData.data = data;
            this.db.save();
        }
        catch (e) {
            logError("Failed to clear high scores: " + e);
        }
    };
    return HighScoreManager;
}());
