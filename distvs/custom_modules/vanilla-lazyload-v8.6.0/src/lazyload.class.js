"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supportsClassList = "classList" in document.createElement("p");
exports.addClass = (element, className) => {
    if (supportsClassList) {
        element.classList.add(className);
        return;
    }
    element.className += (element.className ? " " : "") + className;
};
exports.removeClass = (element, className) => {
    if (supportsClassList) {
        element.classList.remove(className);
        return;
    }
    element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
};
