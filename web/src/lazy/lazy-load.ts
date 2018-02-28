import { ILazyLoadOptions } from './ilazy-load-options';
import { LazyLoadFactory } from './lazy-load-factory';
import { IsClientSide } from './../../node_modules/og-is-client-side';

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

//TODO try make class function async


export { LazyLoad }