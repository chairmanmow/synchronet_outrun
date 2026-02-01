"use strict";
var Rand = (function () {
    function Rand(seed) {
        this.seed = seed !== undefined ? seed : Date.now();
    }
    Rand.prototype.next = function () {
        this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
        return this.seed / 0x7fffffff;
    };
    Rand.prototype.nextInt = function (min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    };
    Rand.prototype.nextFloat = function (min, max) {
        return this.next() * (max - min) + min;
    };
    Rand.prototype.nextBool = function (probability) {
        var p = probability !== undefined ? probability : 0.5;
        return this.next() < p;
    };
    Rand.prototype.pick = function (array) {
        var index = this.nextInt(0, array.length - 1);
        return array[index];
    };
    Rand.prototype.shuffle = function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = this.nextInt(0, i);
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };
    Rand.prototype.setSeed = function (seed) {
        this.seed = seed;
    };
    return Rand;
}());
var globalRand = new Rand();
