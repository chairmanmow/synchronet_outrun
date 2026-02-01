"use strict";
var GameAction;
(function (GameAction) {
    GameAction[GameAction["NONE"] = 0] = "NONE";
    GameAction[GameAction["ACCELERATE"] = 1] = "ACCELERATE";
    GameAction[GameAction["BRAKE"] = 2] = "BRAKE";
    GameAction[GameAction["STEER_LEFT"] = 3] = "STEER_LEFT";
    GameAction[GameAction["STEER_RIGHT"] = 4] = "STEER_RIGHT";
    GameAction[GameAction["ACCEL_LEFT"] = 5] = "ACCEL_LEFT";
    GameAction[GameAction["ACCEL_RIGHT"] = 6] = "ACCEL_RIGHT";
    GameAction[GameAction["BRAKE_LEFT"] = 7] = "BRAKE_LEFT";
    GameAction[GameAction["BRAKE_RIGHT"] = 8] = "BRAKE_RIGHT";
    GameAction[GameAction["USE_ITEM"] = 9] = "USE_ITEM";
    GameAction[GameAction["PAUSE"] = 10] = "PAUSE";
    GameAction[GameAction["QUIT"] = 11] = "QUIT";
})(GameAction || (GameAction = {}));
var InputMap = (function () {
    function InputMap() {
        this.bindings = {};
        this.setupDefaultBindings();
    }
    InputMap.prototype.setupDefaultBindings = function () {
        this.bind(KEY_UP, GameAction.ACCELERATE);
        this.bind(KEY_DOWN, GameAction.BRAKE);
        this.bind(KEY_LEFT, GameAction.STEER_LEFT);
        this.bind(KEY_RIGHT, GameAction.STEER_RIGHT);
        this.bind('7', GameAction.ACCEL_LEFT);
        this.bind('8', GameAction.ACCELERATE);
        this.bind('9', GameAction.ACCEL_RIGHT);
        this.bind('4', GameAction.STEER_LEFT);
        this.bind('5', GameAction.BRAKE);
        this.bind('6', GameAction.STEER_RIGHT);
        this.bind('1', GameAction.BRAKE_LEFT);
        this.bind('2', GameAction.BRAKE);
        this.bind('3', GameAction.BRAKE_RIGHT);
        this.bind(' ', GameAction.USE_ITEM);
        this.bind('p', GameAction.PAUSE);
        this.bind('P', GameAction.PAUSE);
        this.bind('\r', GameAction.PAUSE);
        this.bind('q', GameAction.QUIT);
        this.bind('Q', GameAction.QUIT);
        this.bind('x', GameAction.QUIT);
        this.bind('X', GameAction.QUIT);
        this.bind('\x1b', GameAction.QUIT);
    };
    InputMap.prototype.bind = function (key, action) {
        this.bindings[key] = action;
    };
    InputMap.prototype.getAction = function (key) {
        var action = this.bindings[key];
        return action !== undefined ? action : GameAction.NONE;
    };
    return InputMap;
}());
