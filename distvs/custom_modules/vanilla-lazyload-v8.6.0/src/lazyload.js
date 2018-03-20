"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lazyload_defaults_1 = require("./lazyload.defaults");
const lazyload_utils_1 = require("./lazyload.utils");
const lazyload_viewport_1 = require("./lazyload.viewport");
const lazyload_autoInitialize_1 = require("./lazyload.autoInitialize");
const lazyload_setSources_1 = require("./lazyload.setSources");
const lazyload_class_1 = require("./lazyload.class");
const lazyload_data_1 = require("./lazyload.data");
/*
 * Constructor
 */
const LazyLoad = function (instanceSettings) {
    this._settings = Object.assign({}, lazyload_defaults_1.default, instanceSettings);
    this._queryOriginNode = this._settings.container === window ? document : this._settings.container;
    this._previousLoopTime = 0;
    this._loopTimeout = null;
    this._boundHandleScroll = this.handleScroll.bind(this);
    this._isFirstLoop = true;
    window.addEventListener("resize", this._boundHandleScroll);
    this.update();
};
LazyLoad.prototype = {
    /*
     * Private methods
     */
    _reveal: function (element) {
        const settings = this._settings;
        const errorCallback = function () {
            /* As this method is asynchronous, it must be protected against external destroy() calls */
            if (!settings) {
                return;
            }
            element.removeEventListener("load", loadCallback);
            element.removeEventListener("error", errorCallback);
            lazyload_class_1.removeClass(element, settings.class_loading);
            lazyload_class_1.addClass(element, settings.class_error);
            lazyload_utils_1.callCallback(settings.callback_error, element);
        };
        const loadCallback = function () {
            /* As this method is asynchronous, it must be protected against external destroy() calls */
            if (!settings) {
                return;
            }
            lazyload_class_1.removeClass(element, settings.class_loading);
            lazyload_class_1.addClass(element, settings.class_loaded);
            element.removeEventListener("load", loadCallback);
            element.removeEventListener("error", errorCallback);
            lazyload_utils_1.callCallback(settings.callback_load, element);
        };
        lazyload_utils_1.callCallback(settings.callback_enter, element);
        if (element.tagName === "IMG" || element.tagName === "IFRAME") {
            element.addEventListener("load", loadCallback);
            element.addEventListener("error", errorCallback);
            lazyload_class_1.addClass(element, settings.class_loading);
        }
        lazyload_setSources_1.default(element, settings.data_srcset, settings.data_src);
        lazyload_utils_1.callCallback(settings.callback_set, element);
    },
    _loopThroughElements: function () {
        const settings = this._settings, elements = this._elements, elementsLength = (!elements) ? 0 : elements.length;
        let i, processedIndexes = [], firstLoop = this._isFirstLoop;
        for (i = 0; i < elementsLength; i++) {
            let element = elements[i];
            /* If must skip_invisible and element is invisible, skip it */
            if (settings.skip_invisible && (element.offsetParent === null)) {
                continue;
            }
            if (lazyload_utils_1.isBot || lazyload_viewport_1.default(element, settings.container, settings.threshold)) {
                if (firstLoop) {
                    lazyload_class_1.addClass(element, settings.class_initial);
                }
                /* Start loading the image */
                this._reveal(element);
                /* Marking the element as processed. */
                processedIndexes.push(i);
                lazyload_data_1.setData(element, "was-processed", true);
            }
        }
        /* Removing processed elements from this._elements. */
        while (processedIndexes.length) {
            elements.splice(processedIndexes.pop(), 1);
            lazyload_utils_1.callCallback(settings.callback_processed, elements.length);
        }
        /* Stop listening to scroll event when 0 elements remains */
        if (elementsLength === 0) {
            this._stopScrollHandler();
        }
        /* Sets isFirstLoop to false */
        if (firstLoop) {
            this._isFirstLoop = false;
        }
    },
    _purgeElements: function () {
        const elements = this._elements, elementsLength = elements.length;
        let i, elementsToPurge = [];
        for (i = 0; i < elementsLength; i++) {
            let element = elements[i];
            /* If the element has already been processed, skip it */
            if (lazyload_data_1.getData(element, "was-processed")) {
                elementsToPurge.push(i);
            }
        }
        /* Removing elements to purge from this._elements. */
        while (elementsToPurge.length > 0) {
            elements.splice(elementsToPurge.pop(), 1);
        }
    },
    _startScrollHandler: function () {
        if (!this._isHandlingScroll) {
            this._isHandlingScroll = true;
            this._settings.container.addEventListener("scroll", this._boundHandleScroll);
        }
    },
    _stopScrollHandler: function () {
        if (this._isHandlingScroll) {
            this._isHandlingScroll = false;
            this._settings.container.removeEventListener("scroll", this._boundHandleScroll);
        }
    },
    /*
     * Public methods
     */
    handleScroll: function () {
        const throttle = this._settings.throttle;
        if (throttle !== 0) {
            let now = Date.now();
            let remainingTime = throttle - (now - this._previousLoopTime);
            if (remainingTime <= 0 || remainingTime > throttle) {
                if (this._loopTimeout) {
                    clearTimeout(this._loopTimeout);
                    this._loopTimeout = null;
                }
                this._previousLoopTime = now;
                this._loopThroughElements();
            }
            else if (!this._loopTimeout) {
                this._loopTimeout = setTimeout(function () {
                    this._previousLoopTime = Date.now();
                    this._loopTimeout = null;
                    this._loopThroughElements();
                }.bind(this), remainingTime);
            }
        }
        else {
            this._loopThroughElements();
        }
    },
    update: function () {
        // Converts to array the nodeset obtained querying the DOM from _queryOriginNode with elements_selector
        this._elements = Array.prototype.slice.call(this._queryOriginNode.querySelectorAll(this._settings.elements_selector));
        this._purgeElements();
        this._loopThroughElements();
        this._startScrollHandler();
    },
    destroy: function () {
        window.removeEventListener("resize", this._boundHandleScroll);
        if (this._loopTimeout) {
            clearTimeout(this._loopTimeout);
            this._loopTimeout = null;
        }
        this._stopScrollHandler();
        this._elements = null;
        this._queryOriginNode = null;
        this._settings = null;
    }
};
/* Automatic instances creation if required (useful for async script loading!) */
let autoInitOptions = window.lazyLoadOptions;
if (autoInitOptions) {
    lazyload_autoInitialize_1.default(LazyLoad, autoInitOptions);
}
exports.default = LazyLoad;
