"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lazy_load_factory_1 = require("./lazy-load-factory");
const is_client_side_1 = require("is-client-side");
/**
 * Represents One instance of LazyLoad with functions. Should be safe server side although won't do anything.
 */
class LazyLoad {
    /**
     * Creates the instance of Lazy Load
     * @param options
     */
    constructor(options) {
        //only do smething if we are client side. 
        if (!is_client_side_1.IsClientSide.true()) {
            return null;
        }
        //#### Setup Lazy Load ####
        if (this.LazyLoadInstancePromise == null) {
            this._options = options;
            //Select the correct version of Lazy Load Module ( Promise )
            this.LazyLoadInstancePromise = lazy_load_factory_1.LazyLoadFactory.getLazyLoadPromise(options);
        }
        console.log('lazyLoadInit called: ', this.LazyLoadInstancePromise);
    }
    update() {
        this.LazyLoadInstancePromise.then(lazyload => {
            lazyload.update();
        });
    }
    destroy() {
        this.LazyLoadInstancePromise.then(lazyload => {
            lazyload.destroy();
        });
    }
}
exports.LazyLoad = LazyLoad;
