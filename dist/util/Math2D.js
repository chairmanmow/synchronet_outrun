"use strict";
function clamp(value, min, max) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function distance(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}
function distanceSquared(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return dx * dx + dy * dy;
}
function normalize(v) {
    var len = Math.sqrt(v.x * v.x + v.y * v.y);
    if (len === 0)
        return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
}
function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}
function rotate(p, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return {
        x: p.x * cos - p.y * sin,
        y: p.x * sin + p.y * cos
    };
}
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
function radToDeg(radians) {
    return radians * 180 / Math.PI;
}
function wrapAngle(angle) {
    while (angle > Math.PI)
        angle -= 2 * Math.PI;
    while (angle < -Math.PI)
        angle += 2 * Math.PI;
    return angle;
}
function sign(x) {
    if (x > 0)
        return 1;
    if (x < 0)
        return -1;
    return 0;
}
