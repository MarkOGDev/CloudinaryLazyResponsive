/// <reference path="../node_modules/vanilla-lazyload/typings/lazyload.d.ts" />
/// <reference path="../node_modules/cloudinary-core/cloudinary-core.d.ts" />

import * as cloudinaryJS from "cloudinary-core";
import * as debounce from 'throttle-debounce/debounce';
import * as inViewPort from 'in-viewport';
import * as lazyLoad from 'vanilla-lazyload';

/*

First Page Load:
Load Cloudinory Images
Call Cloudinory Responsive function
Any lazy images will not be loaded, their data will be updated by Cloudinory Responsive function

OnResize:
for Each Lazy Image:
    if Resize Needed and:
        off screen: remove src. Force Cloudinory to update attribute data-src-lazy.

        on screen: let Cloudinory update attribute src.




*/


// #region - Override cloudinary-core Util functions

cloudinaryJS.Util.setAttribute = function (element, name, value) {
    const isInViewPort = inViewPort(element, { offset: 300 }); 

    if (!isInViewPort && name == 'src') //make lazy
    {
        name = 'data-src-lazy'; 
    }

    switch (false) {
        case !(element == null):
            return void 0;
        case !cloudinaryJS.Util.isFunction(element.setAttribute):
            return element.setAttribute(name, value);
    }
};

// #endregion



class LazyResponsiveImages {

    private _cloudinary: cloudinaryJS.Cloudinary = null;
    private _bodyElement: Element = null;
    private _cloudImgHtmlTags: NodeListOf<Element> = null;
    private _lazyLoad: ILazyLoad = null;

    private _prevScreenWidth: number = null;  
    private _lazyResetTriggerWidth: number = null;   


    constructor() { 
    }

      updatePrevScreenWidth() { 
        this._prevScreenWidth = window.outerWidth;
    }

    private updateLazyResetTriggerWidth() {
        //round up to nearest 100.  
        const width = Math.ceil(window.outerWidth / 100) * 100;
        //using window.outerWidth as out container width. If images in different containers that change width at different rates, We would need to listen for a change in the image
        this._lazyResetTriggerWidth = width;
    }


    /**
     * Returns True if the browser width has increased past the point where new images should be loaded
     */
    _resetNeeded(): boolean { 

        const currentScreenWidth = window.outerWidth;
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

        if (!screenWidthBiggerThanTriggerWidth) {
            return false;
        }
        else {
            return true;
        }

    }

    init() {
        //Setup Cloudinory Responsive JS
        //https://cloudinary.com/documentation/responsive_images#automating_responsive_images_with_javascript

        if (this._cloudinary == null) {
            this._cloudinary = new cloudinaryJS.Cloudinary({ cloud_name: "demo" });
            //Setup Responsive images.  
            this._cloudinary.responsive();
        }

        //set the initial screen width values 
        this.updatePrevScreenWidth();
        this.updateLazyResetTriggerWidth();
    }

    resetLazyStatus() {
         
        if (this._resetNeeded()) {

            //Get All Lazy img tags 
            this._cloudImgHtmlTags = document.querySelectorAll('img[data-src-lazy]');
            // console.log('_cloudImgHtmlTags', this._cloudImgHtmlTags);

            for (var i = 0; i < this._cloudImgHtmlTags.length; i++) {

                //If not in view port then make LazyLoad manage the image by removing the Attribute data-was-processed
                const isInViewPort = inViewPort(this._cloudImgHtmlTags[i], { offset: 300 });
                if (!isInViewPort) {
                    //LAZYLOAD: remove data-was-processed="true" so that Lazy Load knows the image is fresh
                    this._cloudImgHtmlTags[i].removeAttribute('data-was-processed');
                }
            }

            //tell LazyLoad to manage the images that we have just reset.
            this._lazyLoad.update();


            //update ImageReloadTriggerWidth
            this.updateLazyResetTriggerWidth();

        }
    }


    lazyLoadInit() {

        //#### Setup Lazy Load ####
        if (this._lazyLoad == null) {

            this._lazyLoad = new lazyLoad({
                data_src: 'src-lazy' //Data attribute storing the src url.
            });
            //console.log('lazyLoad object created', lazyLoad);
        }

    }
}


//Set up LazyResponsiveImages
const myLazyResponsiveImages = new LazyResponsiveImages();
myLazyResponsiveImages.init();
myLazyResponsiveImages.lazyLoadInit();



//Listen for browser resize
window.addEventListener('resize', debounce(300, function (e) {

    //console.log('myLazyResponsiveImages._resizeNeeded()', myLazyResponsiveImages._resetNeeded());

    //Check if imges need resetting to lazy
    myLazyResponsiveImages.resetLazyStatus();


    //update prev screen width
    myLazyResponsiveImages.updatePrevScreenWidth();
}));
