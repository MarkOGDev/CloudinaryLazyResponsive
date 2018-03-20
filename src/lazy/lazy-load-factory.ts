import { ClientHelpers } from './../helpers/client-helpers';
import { ILazyLoadOptions } from './ilazy-load-options';
import { IsClientSide } from 'is-client-side';
import * as es6Promise from 'es6-promise'; 

/**
 * Creates a Promise for either old or new version of LazyLoad.
 * Should be safe server side although wont do anything.
 */
class LazyLoadFactory {


    public static getLazyLoadPromise(options: ILazyLoadOptions): Promise<ILazyLoad> {

        //only do smething if we are client side. 
        if (!IsClientSide.true()) {
            return null;
        }

        let promise: Promise<any> = null;
        if (LazyLoadFactory.useLazyLoadVersionV8()) {

            //####### Check for Promise support. If none load the polyfill ######
            if (!ClientHelpers.promiseSupported()) {
                //old browser may need Promise polyfill. eg. IE 11
                es6Promise.polyfill();
            }
            

            //Load old 
            promise = import('./../../custom_modules/vanilla-lazyload-v8.6.0/').then(lazyLoad8 => {
                console.log('intersection Observer Not Supported: OLD LazyLoad Version Loaded');
                return new lazyLoad8(options);
            });
        }

        //Load latest Version v10x
        //promise = import('./../../node_modules/vanilla-lazyload/dist/lazyload.js').then(lazyLoad => {
        promise = import('vanilla-lazyload/dist/lazyload.js').then(lazyLoad => {
            console.log('intersection Observer Supported: Latest LazyLoad Version Loaded');
            return new lazyLoad(options);
        });

        return promise;
    }


    /**
    * Returns true if we should use LazyLoad V8
    */
    private static useLazyLoadVersionV8(): boolean {
        //new version uses IntersectionObserver which is not supported in older browsers
        const intersectionObserverSupported = ("IntersectionObserver" in window);

        if (intersectionObserverSupported) {
            return false;
        }
        return true;
    }


}

export {
    LazyLoadFactory, ILazyLoadOptions
}