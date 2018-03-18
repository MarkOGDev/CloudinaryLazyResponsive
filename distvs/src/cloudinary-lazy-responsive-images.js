"use strict";
/// <reference path="../node_modules/cloudinary-core/cloudinary-core.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinaryJS = require("../node_modules/cloudinary-core/cloudinary-core.js");
exports.cloudinaryJS = cloudinaryJS;
const debounce = require("throttle-debounce/debounce");
const inViewPort = require("in-viewport");
const viewportSize = require("viewport-size"); //https://github.com/jarvys/viewportSize
const lazy_load_1 = require("./lazy/lazy-load");
/**
 * Lazy Responsive Images
 */
class LazyResponsiveImages {
    constructor(options) {
        //The protected modifier acts much like the private modifier with the exception that members declared protected can also be accessed by instances of deriving classes.
        this._cloudinary = null;
        this._cloudinaryOptions = { cloud_name: 'demo' }; //default options
        // protected _cloudImgHtmlTags: NodeListOf<Element> = null;
        // protected _lazyLoad: Promise<ILazyLoad> = null;
        this._lazyLoad = null;
        // protected _lazyLoad: ILazyLoad = null;
        this._prevScreenWidth = null;
        this._lazyResetTriggerWidth = null;
        /**
         * The data Attribute that indicates a Lazy Image.
         * Omit the first word 'data'. E.g. Set it to  'src-lazy'
         * Defaults to 'src-lazy'
         */
        this._lazyDataAttribute = 'src-lazy'; //default options
        this._threshold = 600;
        console.log('BASE LazyResponsiveImages constructor called', options);
        this._cloudinaryOptions = options.cloudinaryOptions;
        this._lazyDataAttribute = options.lazyDataAttribute;
    }
    /**
 * Retruns true if element near or in viewport
 * @param element
 */
    static isElementInViewPort(element) {
        return inViewPort(element, { offset: 600 });
    }
    /**
     * Overrides cloudinary-core.Util.setAttribute. Takes the new function.
     * @param newFunction
     */
    modifyCloudinarySetAttribute(newFunction) {
        console.log('modifyCloudinarySetAttribute called');
        cloudinaryJS.Util.setAttribute = newFunction;
    }
    /**
     * Define a new function for cloudinary-core.Util.setAttribute.
     */
    cloudinaryJS_setAttribute() {
        return function (element, name, value) {
            console.log('cloudinaryJS.Util.setAttribute', name);
            //See if image is in view port.
            let isInViewPort = LazyResponsiveImages.isElementInViewPort(element);
            //const isInViewPort = inViewPort(element, { offset: 300 });
            //Cloudinary is trying to set the src. we will make it set the data-src-lazy instead
            if (!isInViewPort && name == 'src') {
                name = 'data-src-lazy';
            }
            return element.setAttribute(name, value);
        };
    }
    /**
     * Returns the Viewport width
     */
    getviewportWidth() {
        console.log('getviewportWidth called');
        return viewportSize.getWidth();
    }
    /**
     * Updates the variable '_prevScreenWidth'.  used by window.resize
     */
    updatePrevScreenWidth() {
        console.log('updatePrevScreenWidth called');
        this._prevScreenWidth = this.getviewportWidth();
    }
    /**
     * Updates the variable '_lazyResetTriggerWidth'. Rounds up the width to the nearest 100 to match Cloudinary's resize steps. used by window.resize
     */
    updateLazyResetTriggerWidth() {
        console.log('updateLazyResetTriggerWidth called');
        //round up to nearest 100.  
        const width = Math.ceil(this.getviewportWidth() / 100) * 100;
        this._lazyResetTriggerWidth = width;
    }
    /**
     * Returns True if the browser width has increased past the point where new images should be loaded
     */
    _resetNeeded() {
        console.groupCollapsed('_resetNeeded called');
        const currentScreenWidth = this.getviewportWidth();
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
            //Get All Lazy img tags 
            const processedLazyElements = document.querySelectorAll('[data-was-processed]');
            // console.log('processedLazyElements', processedLazyElements);
            for (var i = 0; i < processedLazyElements.length; i++) {
                //If not in view port then make LazyLoad manage the image by removing the Attribute data-was-processed
                const isInViewPort = inViewPort(processedLazyElements[i], { offset: 300 });
                if (!isInViewPort) {
                    //LAZYLOAD: remove data-was-processed="true" so that Lazy Load knows it has not procedded this element
                    processedLazyElements[i].removeAttribute('data-was-processed');
                }
            }
            //tell LazyLoad to manage the images that we have just reset.
            this.updateLazyLoad();
            //update ImageReloadTriggerWidth
            this.updateLazyResetTriggerWidth();
        }
    }
    /**
     * Creates a new Instence of Cloudinory
     */
    static cloudinarySetup(options) {
        //if no options passed then use demo options.
        //// if (options == null) {
        //     options = { cloud_name: "demo" };
        // }
        return new cloudinaryJS.Cloudinary(options);
    }
    /**
     * Sets up Cloudinary Responsive Images.
     */
    responsiveImagesInit() {
        console.log('responsiveImagesInit called');
        //Setup Cloudinory Responsive JS
        //https://cloudinary.com/documentation/responsive_images#automating_responsive_images_with_javascript
        if (this._cloudinary == null) {
            //Set up Cloudinary
            this._cloudinary = LazyResponsiveImages.cloudinarySetup(this._cloudinaryOptions);
            //Setup Responsive images.  
            this._cloudinary.responsive();
        }
        //set the initial screen width values 
        this.updatePrevScreenWidth();
        this.updateLazyResetTriggerWidth();
    }
    /**
     * Calls the LazyLoad Update Method.
     */
    updateLazyLoad() {
        if (this._lazyLoad != null) {
            this._lazyLoad.update();
        }
    }
    /**
     * Sets up the Window Resize Listener. OnrResize Resests Lazy images so they can be reloaded.
     */
    setupResizeListener() {
        const lazyResponsiveImagesInstance = this;
        console.log('setupResizeListener called', lazyResponsiveImagesInstance);
        //## define the calback here so that 'this' instance is in scope.
        function callback() {
            console.log('resize callback', lazyResponsiveImagesInstance);
            //Check if imges need resetting to lazy
            lazyResponsiveImagesInstance.resetLazyStatus();
            //update prev screen width
            lazyResponsiveImagesInstance.updatePrevScreenWidth();
        }
        //Listen for browser resize- Resets Lazy Images. If 100 images are on screeen and user changes screen width, we dont want to load 100 images again if they are off screen.
        window.addEventListener('resize', debounce(300, function (e) {
            callback();
        }));
    }
    lazyLoadInit() {
        //setup Lazy Images. Pass through the Data attribute used to indicate a Lazy Image. E.g. 'src-lazy'
        //calling the constructor cerates which starts it lokking at page elements.
        this._lazyLoad = new lazy_load_1.LazyLoad({
            data_src: this._lazyDataAttribute //Data attribute storing the src url.
            ,
            threshold: this._threshold
        });
    }
    /**
    * Sets up Responsive / Lazy images
    */
    init() {
        console.groupCollapsed('LazyResponsiveImages init');
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
exports.LazyResponsiveImages = LazyResponsiveImages;
