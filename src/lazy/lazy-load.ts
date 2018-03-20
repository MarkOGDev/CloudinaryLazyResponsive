 

import { ILazyLoadOptions } from './ilazy-load-options';
import { LazyLoadFactory } from './lazy-load-factory';
import { IsClientSide } from 'is-client-side';
import { ILazyLoad } from 'vanilla-lazyload';
 


/**
 * Represents One instance of LazyLoad with functions. Should be safe server side although won't do anything.
 */
class LazyLoad {

    public LazyLoadInstancePromise: Promise<ILazyLoad>;
    private _options: ILazyLoadOptions;

    /**
     * Creates the instance of Lazy Load
     * @param options
     */
    constructor(options: ILazyLoadOptions) {

        console.groupCollapsed('LazyLoad constructor: options', options);

        //only do smething if we are client side. 
        if (!IsClientSide.true()) {
            return null;
        }


        //#### Setup Lazy Load ####
        if (this.LazyLoadInstancePromise == null) {
            this._options = options;
            //Select the correct version of Lazy Load Module ( Promise )
            this.LazyLoadInstancePromise = LazyLoadFactory.getLazyLoadPromise(options);
        }

        console.log('LazyLoadInstancePromise', this.LazyLoadInstancePromise);
        console.groupEnd();
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


export { LazyLoad, ILazyLoadOptions }