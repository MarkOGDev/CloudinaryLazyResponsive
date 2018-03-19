"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewport_size_1 = require("viewport-size"); //https://github.com/jarvys/viewportSize
const inViewPort = require("in-viewport"); //https://github.com/vvo/in-viewport 
class ClientHelpers {
    /**
    * Returns true if element near or in viewport
    * @param element
    */
    static isElementInViewPort(element, elementOffset) {
        const result = inViewPort(element, { offset: elementOffset });
        console.log('isElementInViewPort()', result);
        return result;
    }
    /**
     * Returns the Viewport width
     */
    static getViewportWidth() {
        const width = viewport_size_1.getWidth();
        console.log('getViewportWidth()', width);
        return width;
    }
}
exports.ClientHelpers = ClientHelpers;
