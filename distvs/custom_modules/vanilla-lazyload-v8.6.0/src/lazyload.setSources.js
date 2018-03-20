"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lazyload_data_1 = require("./lazyload.data");
const setSourcesForPicture = function (element, srcsetDataAttribute) {
    const parent = element.parentNode;
    if (parent.tagName !== "PICTURE") {
        return;
    }
    for (let i = 0; i < parent.children.length; i++) {
        let pictureChild = parent.children[i];
        if (pictureChild.tagName === "SOURCE") {
            let sourceSrcset = lazyload_data_1.getData(pictureChild, srcsetDataAttribute);
            if (sourceSrcset) {
                pictureChild.setAttribute("srcset", sourceSrcset);
            }
        }
    }
};
function default_1(element, srcsetDataAttribute, srcDataAttribute) {
    const tagName = element.tagName;
    const elementSrc = lazyload_data_1.getData(element, srcDataAttribute);
    if (tagName === "IMG") {
        setSourcesForPicture(element, srcsetDataAttribute);
        const imgSrcset = lazyload_data_1.getData(element, srcsetDataAttribute);
        if (imgSrcset) {
            element.setAttribute("srcset", imgSrcset);
        }
        if (elementSrc) {
            element.setAttribute("src", elementSrc);
        }
        return;
    }
    if (tagName === "IFRAME") {
        if (elementSrc) {
            element.setAttribute("src", elementSrc);
        }
        return;
    }
    if (elementSrc) {
        element.style.backgroundImage = `url("${elementSrc}")`;
    }
}
exports.default = default_1;
;
