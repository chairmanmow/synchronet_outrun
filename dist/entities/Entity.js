"use strict";
var nextEntityId = 1;
function generateEntityId() {
    return nextEntityId++;
}
var Entity = (function () {
    function Entity() {
        this.id = generateEntityId();
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.rotation = 0;
        this.speed = 0;
        this.active = true;
    }
    return Entity;
}());
