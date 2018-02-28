///// <reference path="../node_modules/vanilla-lazyload/typings/lazyload.d.ts" />
/// <reference path="../node_modules/cloudinary-core/cloudinary-core.d.ts" />

import * as cloudinaryJS from "cloudinary-core";
import * as debounce from 'throttle-debounce/debounce';
import * as inViewPort from 'in-viewport';
//import * as lazyLoad from './../node_modules/vanilla-lazyload/dist/lazyload.js';
//import * as lazyLoad8 from './../custom_modules/vanilla-lazyload-v8.6.0/';         //older version supports browsers without IntersectionObserver feature. e.g. ie 11.
import * as viewportSize from 'viewport-size';   //https://github.com/jarvys/viewportSize

//import {
//    LazyLoadFactory
//    //, lazyLoad, lazyLoad8
//} from './lazy/lazy-load-factory';


import { LazyLoad } from './lazy/lazy-load';

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
 * Class Settings Interface
 */
interface iClriSettings {
    cloudinaryOptions?: cloudinaryJS.Configuration.Options,
    lazyDataAttribute?: string
    //l,azyOffSet?: string
}

/**
 * Lazy Responsive Images
 */
class LazyResponsiveImages {

    //The protected modifier acts much like the private modifier with the exception that members declared protected can also be accessed by instances of deriving classes.
    protected _cloudinary: cloudinaryJS.Cloudinary = null;
    protected _cloudinaryOptions: cloudinaryJS.Configuration.Options = { cloud_name: 'demo' };      //default options
    // protected _cloudImgHtmlTags: NodeListOf<Element> = null;

    // protected _lazyLoad: Promise<ILazyLoad> = null;

    private _lazyLoad: LazyLoad = null;

    // protected _lazyLoad: ILazyLoad = null;
    protected _prevScreenWidth: number = null;
    protected _lazyResetTriggerWidth: number = null;

    /**
     * The data Attribute that indicates a Lazy Image.
     * Omit the first word 'data'. E.g. Set it to  'src-lazy'
     * Defaults to 'src-lazy'
     */
    protected _lazyDataAttribute: string = 'src-lazy';                                               //default options
    public readonly _threshold: number = 600;


    constructor(options?: iClriSettings) {
        console.log('BASE LazyResponsiveImages constructor called', options);

        this._cloudinaryOptions = options.cloudinaryOptions;
        this._lazyDataAttribute = options.lazyDataAttribute;
    }


    /**
 * Retruns true if element near or in viewport
 * @param element
 */
    public static isElementInViewPort(element: Element) {
        return inViewPort(element, { offset: 600 });
    }

    /**
     * Overrides cloudinary-core.Util.setAttribute. Takes the new function.
     * @param newFunction
     */
    protected modifyCloudinarySetAttribute(newFunction) {
        console.log('modifyCloudinarySetAttribute called');
        cloudinaryJS.Util.setAttribute = newFunction;
    }


    /**
     * Define a new function for cloudinary-core.Util.setAttribute.
     */
    protected cloudinaryJS_setAttribute() {
        return function (element, name, value) {
            console.log('cloudinaryJS.Util.setAttribute', name);

            //See if image is in view port.
            let isInViewPort: boolean = LazyResponsiveImages.isElementInViewPort(element);
            //const isInViewPort = inViewPort(element, { offset: 300 });


            //Cloudinary is trying to set the src. we will make it set the data-src-lazy instead
            if (!isInViewPort && name == 'src') //make lazy (image not in view port)
            {
                name = 'data-src-lazy';
            }

            return element.setAttribute(name, value);

            //alert(element.setAttribute);


            //not sure what this code was for.
            //switch (false) {
            //    case !(element == null):
            //        alert(0);
            //        return void 0;
            //    case !cloudinaryJS.Util.isFunction(element.setAttribute):
            //        alert(1);
            //        return element.setAttribute(name, value);
            //}
        };
    }

    /**
     * Returns the Viewport width
     */
    protected getviewportWidth() {
        console.log('getviewportWidth called');
        return viewportSize.getWidth();
    }

    /**
     * Updates the variable '_prevScreenWidth'.  used by window.resize
     */
    protected updatePrevScreenWidth() {
        console.log('updatePrevScreenWidth called');
        this._prevScreenWidth = this.getviewportWidth();
    }

    /**
     * Updates the variable '_lazyResetTriggerWidth'. Rounds up the width to the nearest 100 to match Cloudinary's resize steps. used by window.resize
     */
    protected updateLazyResetTriggerWidth() {
        console.log('updateLazyResetTriggerWidth called');
        //round up to nearest 100.  
        const width = Math.ceil(this.getviewportWidth() / 100) * 100;
        this._lazyResetTriggerWidth = width;
    }

    /**
     * Returns True if the browser width has increased past the point where new images should be loaded
     */
    protected _resetNeeded(): boolean {
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
    protected resetLazyStatus() {
        console.log('resetLazyStatus called');
        if (this._resetNeeded()) {

            //Get All Lazy img tags 
            const processedLazyElements: NodeListOf<Element> = document.querySelectorAll('[data-was-processed]');
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
    protected static cloudinarySetup(options?: cloudinaryJS.Configuration.Options): cloudinaryJS.Cloudinary {
        //if no options passed then use demo options.
        //// if (options == null) {
        //     options = { cloud_name: "demo" };
        // }

        return new cloudinaryJS.Cloudinary(options);
        // return new cloudinaryJS.Cloudinary({ cloud_name: "demo" });
    }

    /**
     * Sets up Cloudinary Responsive Images.
     */
    protected responsiveImagesInit() {
        console.log('responsiveImagesInit called');
        //Setup Cloudinory Responsive JS
        //https://cloudinary.com/documentation/responsive_images#automating_responsive_images_with_javascript

        if (this._cloudinary == null) {

            //Set up Cloudinary
            this._cloudinary = LazyResponsiveImages.cloudinarySetup(this._cloudinaryOptions);

            //  this._cloudinary = new cloudinaryJS.Cloudinary({ cloud_name: "demo" });
            //  console.log('YOYOYOYYOthis._cloudinaryOptions', this._cloudinaryOptions);

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
    protected updateLazyLoad() {

        if (this._lazyLoad != null) {
            this._lazyLoad.update();
        }

        //if (this._lazyLoad != null) {
        //    //tell LazyLoad to manage the images that we have just reset.
        //    // this._lazyLoad.update();

        //    //using LazyLoad Promise
        //    this._lazyLoad.then(lazyLoad => {
        //        //tell LazyLoad to manage the images that we have just reset.
        //        lazyLoad.update();
        //    });

        //}
    }



    /**
     * Sets up the Window Resize Listener. OnrResize Resests Lazy images so they can be reloaded.
     */
    protected setupResizeListener() {

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




    protected lazyLoadInit() {
        //setup Lazy Images. Pass through the Data attribute used to indicate a Lazy Image. E.g. 'src-lazy'
        //calling the constructor cerates which starts it lokking at page elements.
        this._lazyLoad = new LazyLoad({
            data_src: this._lazyDataAttribute       //Data attribute storing the src url.
            , threshold: this._threshold
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

        //setup Lazy Images. Pass through the Data attribute used to indicate a Lazy Image. E.g. 'src-lazy'
        //calling the constructor cerates which starts it lokking at page elements.
        //this._lazyLoad = new LazyLoad({
        //    data_src: this._lazyDataAttribute       //Data attribute storing the src url.
        //    , threshold: this._threshold
        //});

        // this.lazyLoadInit();
        // this._lazyLoad = myLazyLoadProvider.LazyLoadInstancePromise;

        //set up lazy load. We override this in derived classes that do more work.
        this.lazyLoadInit();


        //set up the Window Resize Listener.
        this.setupResizeListener();
        console.groupEnd();
    }
}



export { iClriSettings, LazyResponsiveImages, cloudinaryJS };