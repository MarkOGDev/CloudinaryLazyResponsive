"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBot = !("onscroll" in window) || /glebot/.test(navigator.userAgent);
exports.callCallback = function (callback, argument) {
    if (callback) {
        callback(argument);
    }
};
