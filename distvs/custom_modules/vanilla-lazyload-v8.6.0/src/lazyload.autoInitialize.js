"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Creates instance and notifies it through the window element */
const createInstance = function (classObj, options) {
    var event;
    let eventString = "LazyLoad::Initialized";
    let instance = new classObj(options);
    try {
        // Works in modern browsers
        event = new CustomEvent(eventString, { detail: { instance } });
    }
    catch (err) {
        // Works in Internet Explorer (all versions)
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventString, false, false, { instance });
    }
    window.dispatchEvent(event);
};
/* Auto initialization of one or more instances of lazyload, depending on the
    options passed in (plain object or an array) */
function default_1(classObj, options) {
    let optsLength = options.length;
    if (!optsLength) {
        // Plain object
        createInstance(classObj, options);
    }
    else {
        // Array of objects
        for (let i = 0; i < optsLength; i++) {
            createInstance(classObj, options[i]);
        }
    }
}
exports.default = default_1;
;
