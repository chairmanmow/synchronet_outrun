"use strict";
var RacerDriver = (function () {
    function RacerDriver(skill, name) {
        this.skill = clamp(skill, 0.3, 1.0);
        this.name = name || this.generateName();
        this.targetSpeed = 0.35 + (this.skill * 0.30);
        this._aggression = 0.3 + (this.skill * 0.5);
        this._reactionDelay = 0.3 - (this.skill * 0.25);
        this.preferredLine = (Math.random() - 0.5) * 0.6;
        this.steerAmount = 0;
        this.variationTimer = 0;
        this.speedVariation = 0;
        this.canMove = false;
    }
    RacerDriver.prototype.setCanMove = function (canMove) {
        this.canMove = canMove;
    };
    RacerDriver.prototype.generateName = function () {
        var firstNames = [
            'Max', 'Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley',
            'Ace', 'Blaze', 'Storm', 'Flash', 'Turbo', 'Nitro', 'Dash', 'Spike'
        ];
        var lastNames = [
            'Speed', 'Racer', 'Driver', 'Storm', 'Thunder', 'Blitz', 'Volt', 'Dash',
            'Rocket', 'Jet', 'Zoom', 'Rush', 'Gear', 'Torque', 'Drift', 'Burn'
        ];
        var firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        var lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return firstName + ' ' + lastName;
    };
    RacerDriver.prototype.update = function (vehicle, _track, dt) {
        if (!this.canMove) {
            return {
                accelerate: 0,
                steer: 0,
                useItem: false
            };
        }
        this.variationTimer += dt;
        if (this.variationTimer > 2 + Math.random() * 2) {
            this.variationTimer = 0;
            this.speedVariation = (Math.random() - 0.5) * 0.1 * (1 - this.skill);
        }
        var maxSpeedForAI = (this.targetSpeed + this.speedVariation) * VEHICLE_PHYSICS.MAX_SPEED;
        var accelerate;
        if (vehicle.speed < maxSpeedForAI * 0.95) {
            accelerate = 1;
        }
        else if (vehicle.speed > maxSpeedForAI * 1.05) {
            accelerate = -0.3;
        }
        else {
            accelerate = 0;
        }
        if (vehicle.isCrashed) {
            accelerate = 0.3;
        }
        var currentX = vehicle.playerX || 0;
        var targetX = this.preferredLine;
        var lineDiff = targetX - currentX;
        this.steerAmount = lineDiff * (0.5 + this.skill * 0.5);
        this.steerAmount = clamp(this.steerAmount, -0.8, 0.8);
        var wobble = (Math.random() - 0.5) * 0.1 * (1 - this.skill);
        this.steerAmount += wobble;
        if (currentX < -0.8) {
            this.steerAmount = 0.5;
        }
        else if (currentX > 0.8) {
            this.steerAmount = -0.5;
        }
        return {
            accelerate: clamp(accelerate, 0, 1),
            steer: this.steerAmount,
            useItem: false
        };
    };
    RacerDriver.prototype.getSkill = function () {
        return this.skill;
    };
    RacerDriver.prototype.getAggression = function () {
        return this._aggression;
    };
    RacerDriver.prototype.getReactionDelay = function () {
        return this._reactionDelay;
    };
    return RacerDriver;
}());
