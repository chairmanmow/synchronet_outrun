"use strict";
var Controls = (function () {
    function Controls(inputMap) {
        this.inputMap = inputMap;
        this.lastKeyTime = {};
        this.activeActions = {};
        this.justPressedActions = {};
        this.holdThreshold = 200;
        this.currentAccel = 0;
        this.currentSteer = 0;
    }
    Controls.prototype.handleKey = function (key, now) {
        var action = this.inputMap.getAction(key);
        if (action !== GameAction.NONE) {
            if (!this.activeActions[action]) {
                this.justPressedActions[action] = true;
            }
            this.activeActions[action] = true;
            this.lastKeyTime[action] = now;
            this.applyAction(action);
        }
    };
    Controls.prototype.applyAction = function (action) {
        switch (action) {
            case GameAction.ACCELERATE:
                this.currentAccel = 1;
                break;
            case GameAction.BRAKE:
                this.currentAccel = -1;
                break;
            case GameAction.STEER_LEFT:
                this.currentSteer = -1;
                break;
            case GameAction.STEER_RIGHT:
                this.currentSteer = 1;
                break;
            case GameAction.ACCEL_LEFT:
                this.currentAccel = 1;
                this.currentSteer = -1;
                break;
            case GameAction.ACCEL_RIGHT:
                this.currentAccel = 1;
                this.currentSteer = 1;
                break;
            case GameAction.BRAKE_LEFT:
                this.currentAccel = -1;
                this.currentSteer = -1;
                break;
            case GameAction.BRAKE_RIGHT:
                this.currentAccel = -1;
                this.currentSteer = 1;
                break;
        }
    };
    Controls.prototype.update = function (now) {
        this.currentSteer = 0;
        for (var actionStr in this.lastKeyTime) {
            var action = parseInt(actionStr, 10);
            if (now - this.lastKeyTime[action] > this.holdThreshold) {
                this.activeActions[action] = false;
                delete this.lastKeyTime[action];
                if (action === GameAction.ACCELERATE || action === GameAction.BRAKE ||
                    action === GameAction.ACCEL_LEFT || action === GameAction.ACCEL_RIGHT ||
                    action === GameAction.BRAKE_LEFT || action === GameAction.BRAKE_RIGHT) {
                    this.currentAccel = 0;
                }
            }
            else if (this.activeActions[action]) {
                this.applyAction(action);
            }
        }
    };
    Controls.prototype.getAcceleration = function () {
        return this.currentAccel;
    };
    Controls.prototype.getSteering = function () {
        return this.currentSteer;
    };
    Controls.prototype.isActive = function (action) {
        return this.activeActions[action] === true;
    };
    Controls.prototype.wasJustPressed = function (action) {
        return this.justPressedActions[action] === true;
    };
    Controls.prototype.consumeJustPressed = function (action) {
        if (this.justPressedActions[action] === true) {
            this.justPressedActions[action] = false;
            return true;
        }
        return false;
    };
    Controls.prototype.endFrame = function () {
        this.justPressedActions = {};
    };
    Controls.prototype.clearAll = function () {
        this.activeActions = {};
        this.justPressedActions = {};
        this.lastKeyTime = {};
    };
    return Controls;
}());
