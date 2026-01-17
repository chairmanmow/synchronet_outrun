"use strict";
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 7] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 6] = "INFO";
    LogLevel[LogLevel["NOTICE"] = 5] = "NOTICE";
    LogLevel[LogLevel["WARNING"] = 4] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["CRITICAL"] = 2] = "CRITICAL";
    LogLevel[LogLevel["ALERT"] = 1] = "ALERT";
    LogLevel[LogLevel["EMERGENCY"] = 0] = "EMERGENCY";
})(LogLevel || (LogLevel = {}));
var currentLogLevel = LogLevel.INFO;
function setLogLevel(level) {
    currentLogLevel = level;
}
function logMessage(level, message) {
    if (level <= currentLogLevel) {
        if (typeof log !== 'undefined') {
            log(level, "[OutRun] " + message);
        }
    }
}
function logDebug(message) {
    logMessage(LogLevel.DEBUG, message);
}
function logInfo(message) {
    logMessage(LogLevel.INFO, message);
}
function logWarning(message) {
    logMessage(LogLevel.WARNING, message);
}
function logError(message) {
    logMessage(LogLevel.ERROR, message);
}
