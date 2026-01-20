"use strict";
var DEBUG_LOG_FILE = "outrun_debug.log";
function repeatString(str, count) {
    var result = "";
    for (var i = 0; i < count; i++) {
        result += str;
    }
    return result;
}
var DebugLogger = (function () {
    function DebugLogger() {
        this.file = null;
        this.enabled = false;
        this.startTime = 0;
        this.logPath = "";
    }
    DebugLogger.prototype.init = function () {
        try {
            this.logPath = DEBUG_LOG_FILE;
            this.startTime = Date.now();
            if (typeof console !== 'undefined' && console.print) {
                console.print("DEBUG: Log path = " + this.logPath + "\r\n");
            }
            this.file = new File(this.logPath);
            if (!this.file.open("w")) {
                if (typeof console !== 'undefined' && console.print) {
                    console.print("DEBUG: Failed to open log file!\r\n");
                }
                this.enabled = false;
                return false;
            }
            this.enabled = true;
            this.writeRaw(repeatString("=", 60));
            this.writeRaw("OutRun ANSI Debug Log");
            this.writeRaw("Started: " + new Date().toISOString());
            this.writeRaw("Log file: " + this.logPath);
            this.writeRaw(repeatString("=", 60));
            this.writeRaw("");
            return true;
        }
        catch (e) {
            this.enabled = false;
            return false;
        }
    };
    DebugLogger.prototype.writeRaw = function (text) {
        if (!this.enabled || !this.file)
            return;
        try {
            this.file.writeln(text);
            this.file.flush();
        }
        catch (e) {
        }
    };
    DebugLogger.prototype.getElapsed = function () {
        var elapsed = (Date.now() - this.startTime) / 1000;
        return elapsed.toFixed(3);
    };
    DebugLogger.prototype.write = function (level, message) {
        if (!this.enabled || !this.file)
            return;
        var timestamp = "[" + this.getElapsed() + "s]";
        var line = timestamp + " " + level + " " + message;
        this.writeRaw(line);
    };
    DebugLogger.prototype.debug = function (message) {
        this.write("[DEBUG]", message);
    };
    DebugLogger.prototype.info = function (message) {
        this.write("[INFO ]", message);
    };
    DebugLogger.prototype.warn = function (message) {
        this.write("[WARN ]", message);
    };
    DebugLogger.prototype.error = function (message) {
        this.write("[ERROR]", message);
    };
    DebugLogger.prototype.exception = function (message, error) {
        this.write("[ERROR]", message);
        if (error) {
            this.writeRaw("  Exception: " + String(error));
            if (error.stack) {
                this.writeRaw("  Stack trace:");
                var stack = String(error.stack).split("\n");
                for (var i = 0; i < stack.length; i++) {
                    this.writeRaw("    " + stack[i]);
                }
            }
            if (error.fileName) {
                this.writeRaw("  File: " + error.fileName);
            }
            if (error.lineNumber) {
                this.writeRaw("  Line: " + error.lineNumber);
            }
        }
    };
    DebugLogger.prototype.logState = function (label, state) {
        this.write("[STATE]", label);
        try {
            var json = JSON.stringify(state, null, 2);
            var lines = json.split("\n");
            for (var i = 0; i < lines.length; i++) {
                this.writeRaw("  " + lines[i]);
            }
        }
        catch (e) {
            this.writeRaw("  (could not serialize state)");
        }
    };
    DebugLogger.prototype.logVehicle = function (vehicle) {
        this.debug("Vehicle: playerX=" + vehicle.playerX.toFixed(3) +
            " trackZ=" + vehicle.trackZ.toFixed(1) +
            " speed=" + vehicle.speed.toFixed(1) +
            " offRoad=" + vehicle.isOffRoad +
            " crashed=" + vehicle.isCrashed +
            " lap=" + vehicle.lap);
    };
    DebugLogger.prototype.logInput = function (key, action) {
        var keyStr = key;
        if (key === " ")
            keyStr = "SPACE";
        else if (key === "\r")
            keyStr = "ENTER";
        else if (key.charCodeAt(0) < 32)
            keyStr = "0x" + key.charCodeAt(0).toString(16);
        this.debug("Input: key='" + keyStr + "' action=" + action);
    };
    DebugLogger.prototype.separator = function (label) {
        if (label) {
            this.writeRaw("");
            this.writeRaw("--- " + label + " " + repeatString("-", 50 - label.length));
        }
        else {
            this.writeRaw(repeatString("-", 60));
        }
    };
    DebugLogger.prototype.close = function () {
        if (this.file) {
            this.writeRaw("");
            this.writeRaw(repeatString("=", 60));
            this.writeRaw("Log ended: " + new Date().toISOString());
            this.writeRaw(repeatString("=", 60));
            try {
                this.file.close();
            }
            catch (e) {
            }
            this.file = null;
        }
        this.enabled = false;
    };
    return DebugLogger;
}());
var debugLog = new DebugLogger();
