"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataPrefix = "data-";
exports.getData = (element, attribute) => {
    return element.getAttribute(dataPrefix + attribute);
};
exports.setData = (element, attribute, value) => {
    return element.setAttribute(dataPrefix + attribute, value);
};
