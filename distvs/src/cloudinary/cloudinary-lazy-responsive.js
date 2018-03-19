"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_helpers_1 = require("./../helpers/client-helpers");
const cloudinary_core_1 = require("cloudinary-core");
const lazy_load_1 = require("./../lazy/lazy-load");
//import { debounce1 } from 'throttle-debounce/debounce';          //Throttle/debounce your functions. https://github.com/niksy/throttle-debounce
const debounce = require("throttle-debounce/debounce");
//import * as cloudinaryJS from "cloudinary-core";
//import * as debounce from 'throttle-debounce/debounce';
//import * as inViewPort from 'in-viewport';
//import * as viewportSize from 'viewport-size';   //https://github.com/jarvys/viewportSize
/*

First Page Load:
Load Cloudinory Images
Call Cloudinory Responsive function
Any lazy images will not be loaded, their data will be updated by Cloudinory Responsive function

OnResize:
for Each Lazy Image:
    if Resize Needed and:
        off screen: Force Cloudinory to update attribute 'data-src-lazy' instead of 'src'

        on screen: let Cloudinory update attribute src.
*/
/**
 * Lazy Responsive Images
 */
class CloudinaryLazyResponsive {
    constructor(options) {
        this._lazyLoad = null;
        this._prevScreenWidth = null;
        this._lazyResetTriggerWidth = null;
        console.log('BASE LazyResponsiveImages constructor called', options);
        if (options != null) {
            this._options = options;
        }
    }
    /**
     * Overrides cloudinary-core.Util.setAttribute. Takes the new function.
     * @param newFunction
     */
    modifyCloudinarySetAttribute(newFunction) {
        console.log('modifyCloudinarySetAttribute called');
        cloudinary_core_1.Util.setAttribute = newFunction;
    }
    /**
     * Define a new function for cloudinary-core.Util.setAttribute.
     */
    cloudinaryJS_setAttribute() {
        const threshold = this._options.lazyLoadOptions.threshold;
        return function (element, name, value) {
            console.log('cloudinaryJS.Util.setAttribute', name);
            //See if image is in view port.
            let isInViewPort = client_helpers_1.ClientHelpers.isElementInViewPort(element, threshold);
            //Cloudinary is trying to set the src. we will make it set the data-src-lazy instead
            if (!isInViewPort && name == 'src') {
                name = 'data-src-lazy';
            }
            return element.setAttribute(name, value);
        };
    }
    /**
     * Updates the variable '_prevScreenWidth'.  used by window.resize
     */
    updatePrevScreenWidth() {
        console.log('updatePrevScreenWidth called');
        this._prevScreenWidth = client_helpers_1.ClientHelpers.getViewportWidth();
    }
    /**
     * Updates the variable '_lazyResetTriggerWidth'. Rounds up the width to the nearest 100 to match Cloudinary's resize steps. used by window.resize
     */
    updateLazyResetTriggerWidth() {
        console.log('updateLazyResetTriggerWidth called');
        //round up to nearest 100.  
        const width = Math.ceil(client_helpers_1.ClientHelpers.getViewportWidth() / 100) * 100;
        this._lazyResetTriggerWidth = width;
    }
    /**
     * Returns True if the browser width has increased past the point where new images should be loaded
     */
    _resetNeeded() {
        console.groupCollapsed('_resetNeeded called');
        const currentScreenWidth = client_helpers_1.ClientHelpers.getViewportWidth();
        console.log('currentScreenWidth', currentScreenWidth);
        const screenGotBigger = currentScreenWidth > this._prevScreenWidth;
        console.log('screenGotBigger', screenGotBigger);
        console.log('this.prevScreenWidth', this._prevScreenWidth);
        if (!screenGotBigger) {
            return false;
        }
        const screenWidthBiggerThanTriggerWidth = currentScreenWidth > this._lazyResetTriggerWidth;
        console.log('screenWidthBiggerThanTriggerWidth', screenWidthBiggerThanTriggerWidth);
        console.log('this.lazyResetTriggerWidth', this._lazyResetTriggerWidth);
        console.groupEnd();
        if (!screenWidthBiggerThanTriggerWidth) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * used by window.resize
     * Rest Lazy images and allow LazyLoader to load them again at the appropiate time.
     */
    resetLazyStatus() {
        console.log('resetLazyStatus called');
        if (this._resetNeeded()) {
            // alert('reset lazy images');
            //Get All Lazy img tags 
            const processedLazyElements = document.querySelectorAll('[data-was-processed]');
            console.log('Images with data-was-processed', processedLazyElements);
            for (var i = 0; i < processedLazyElements.length; i++) {
                //If not in view port then make LazyLoad manage the image by removing the Attribute data-was-processed
                const isInViewPort = client_helpers_1.ClientHelpers.isElementInViewPort(processedLazyElements[i], this._options.lazyLoadOptions.threshold);
                console.log('Image ' + i + ' isInViewPort', isInViewPort);
                if (!isInViewPort) {
                    //LAZYLOAD: remove data-was-processed="true" so that Lazy Load knows it has not procedded this element
                    processedLazyElements[i].removeAttribute('data-was-processed');
                    console.log('Removing data-was-processed from ', processedLazyElements[i]);
                }
            }
            //tell LazyLoad to manage the images that we have just reset.
            this.updateLazyLoad();
            //update ImageReloadTriggerWidth
            this.updateLazyResetTriggerWidth();
        }
    }
    /**
     * Sets up Cloudinary Responsive Images.
     */
    responsiveImagesInit() {
        console.log('responsiveImagesInit() Create cloudinaryJs');
        //Setup Cloudinory Responsive JS
        //https://cloudinary.com/documentation/responsive_images#automating_responsive_images_with_javascript
        if (this.cloudinaryJs == null) {
            //Set up Cloudinary
            this.cloudinaryJs = new cloudinary_core_1.Cloudinary(this._options.cloudinaryOptions);
            //Setup Responsive images.  
            this.cloudinaryJs.responsive();
        }
        //set the initial screen width values 
        this.updatePrevScreenWidth();
        this.updateLazyResetTriggerWidth();
    }
    /**
     * Calls the LazyLoad Update Method.
     */
    updateLazyLoad() {
        console.log('updateLazyLoad()');
        if (this._lazyLoad != null) {
            this._lazyLoad.update();
        }
    }
    /**
     * Sets up the Window Resize Listener. On Resize Resets Lazy images so they can be reloaded.
     */
    setupResizeListener() {
        const lazyResponsiveImagesInstance = this;
        console.log('setupResizeListener()', lazyResponsiveImagesInstance);
        //## define the calback here so that 'this' instance is in scope.
        function callback() {
            console.log('resize callback', lazyResponsiveImagesInstance);
            //Check if imges need resetting to lazy
            lazyResponsiveImagesInstance.resetLazyStatus();
            //update prev screen width
            lazyResponsiveImagesInstance.updatePrevScreenWidth();
        }
        //Listen for browser resize- Resets Lazy Images. If 100 images are on loaded and user changes screen width, we dont want to load 100 images again if they are off screen.
        //https://github.com/niksy/throttle-debounce#debouncedelay-atbegin-callback
        //debounce(delay, atBegin, callback)
        //Debounce execution of a function. Debouncing, unlike throttling, guarantees that a function is only executed a single time, either at the very beginning of a series of calls, or at the very end.
        window.addEventListener('resize', debounce(300, function (e) {
            console.log('Window Even Listener resize');
            callback();
        }));
    }
    lazyLoadInit() {
        console.log('lazyLoadInit()');
        //setup Lazy Images. Pass through the Data attribute used to indicate a Lazy Image. E.g. 'src-lazy'
        //calling the constructor cerates which starts it lokking at page elements.
        this._lazyLoad = new lazy_load_1.LazyLoad({
            data_src: this._options.lazyLoadOptions.data_src,
            threshold: this._options.lazyLoadOptions.threshold
        });
    }
    /**
    * Sets up Responsive / Lazy images
    */
    init() {
        console.log('LazyResponsiveImages init');
        //Add our custom Set Attribute to Cloudinary
        this.modifyCloudinarySetAttribute(this.cloudinaryJS_setAttribute());
        //setup responsive images. THis will update image urls to the responsive url or Load the image if it is on screen.
        this.responsiveImagesInit();
        //set up lazy load. We override this in derived classes that need more config/complex setup.
        this.lazyLoadInit();
        //set up the Window Resize Listener.
        this.setupResizeListener();
        console.groupEnd();
    }
}
exports.CloudinaryLazyResponsive = CloudinaryLazyResponsive;
