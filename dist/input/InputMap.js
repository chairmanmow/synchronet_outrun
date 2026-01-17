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
        this.bind('Q', GameAction.ACCEL_LEFT);
        this.bind('U', GameAction.ACCEL_LEFT);
        this.bind('W', GameAction.ACCELERATE);
        this.bind('I', GameAction.ACCELERATE);
        this.bind('E', GameAction.ACCEL_RIGHT);
        this.bind('P', GameAction.ACCEL_RIGHT);
        this.bind('q', GameAction.STEER_LEFT);
        this.bind('u', GameAction.STEER_LEFT);
        this.bind('w', GameAction.ACCELERATE);
        this.bind('i', GameAction.ACCELERATE);
        this.bind('e', GameAction.STEER_RIGHT);
        this.bind('p', GameAction.STEER_RIGHT);
        this.bind('A', GameAction.BRAKE_LEFT);
        this.bind('a', GameAction.BRAKE_LEFT);
        this.bind('S', GameAction.BRAKE);
        this.bind('s', GameAction.BRAKE);
        this.bind('D', GameAction.BRAKE_RIGHT);
        this.bind('d', GameAction.BRAKE_RIGHT);
        this.bind('Z', GameAction.ACCELERATE);
        this.bind('z', GameAction.ACCELERATE);
        this.bind('C', GameAction.BRAKE);
        this.bind('c', GameAction.BRAKE);
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
        this.bind('\r', GameAction.USE_ITEM);
        this.bind('x', GameAction.PAUSE);
        this.bind('X', GameAction.PAUSE);
        this.bind('0', GameAction.QUIT);
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
