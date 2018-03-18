"use strict";
/// <reference path="../../node_modules/vanilla-lazyload/typings/lazyload.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const is_client_side_1 = require("is-client-side");
/**
 * Creates a Promise for either old or new version of LazyLoad.
 * Should be safe server side although wont do anything.
 */
class LazyLoadFactory {
    static getLazyLoadPromise(options) {
        //only do smething if we are client side. 
        if (!is_client_side_1.IsClientSide.true()) {
            return null;
        }
        let promise = null;
        if (LazyLoadFactory.useLazyLoadVersionV8()) {
            //Load old 
            promise = Promise.resolve().then(() => require('./../../custom_modules/vanilla-lazyload-v8.6.0/')).then(lazyLoad8 => {
                console.log('intersectionObserverSupported: OLD Version Selected');
                return new lazyLoad8(options);
            });
        }
        //Load latest Version v10x
        promise = Promise.resolve().then(() => require('./../../node_modules/vanilla-lazyload/dist/lazyload.js')).then(lazyLoad => {
            console.log('intersectionObserverSupported: Latest Version Selected');
            return new lazyLoad(options);
        });
        return promise;
    }
    /**
    * Returns true if we should use LazyLoad V8
    */
    static useLazyLoadVersionV8() {
        //new version uses IntersectionObserver which is not supported in older browsers
        const intersectionObserverSupported = ("IntersectionObserver" in window);
        console.log('intersectionObserverSupported', intersectionObserverSupported);
        if (intersectionObserverSupported) {
            return false;
        }
        return true;
    }
}
exports.LazyLoadFactory = LazyLoadFactory;
