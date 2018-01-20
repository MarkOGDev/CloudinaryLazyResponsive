/// <reference path="../node_modules/vanilla-lazyload/typings/lazyload.d.ts" />
/// <reference path="../node_modules/cloudinary-core/cloudinary-core.d.ts" />

import * as cloudinaryJS from "cloudinary-core";
import * as debounce from 'throttle-debounce/debounce';
import * as inViewPort from 'in-viewport';
import * as lazyLoad from 'vanilla-lazyload';
import * as viewportSize from 'viewport-size';   //https://github.com/jarvys/viewportSize



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



interface scrollingContainerClassInfo {
    [constainerClassName: string]: string;
}


class LazyResponsiveImages {

    private _cloudinary: cloudinaryJS.Cloudinary = null;
    private _bodyElement: Element = null;
    private _cloudImgHtmlTags: NodeListOf<Element> = null;
    private _lazyLoad: ILazyLoad = null;

    private _prevScreenWidth: number = null;
    private _lazyResetTriggerWidth: number = null;

    constructor() {

        this.modifyCloudinarySetAttribute();


        //Display viewport dimension on the page.
        // const info = document.getElementById('info');
        // info.innerText = viewportSize.getWidth() + ' * ' + viewportSize.getHeight();

    }

    private modifyCloudinarySetAttribute() {
        console.log('modifyCloudinarySetAttribute called');

        // #region - Override cloudinary-core Util functions

        cloudinaryJS.Util.setAttribute = function (element, name, value) {
            //See if image is in view port.
            const isInViewPort = inViewPort(element, { offset: 300 });

            if (!isInViewPort && name == 'src') //make lazy (not in view port)
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

    }


    private getviewportWidth() {
        console.log('getviewportWidth called');
        return viewportSize.getWidth();
    }

    /**
     * used by window.resize 
     */
    updatePrevScreenWidth() {
        console.log('updatePrevScreenWidth called');
        this._prevScreenWidth = this.getviewportWidth();
    }

    private updateLazyResetTriggerWidth() {
        console.log('updateLazyResetTriggerWidth called');
        //round up to nearest 100.  
        const width = Math.ceil(this.getviewportWidth() / 100) * 100;
        this._lazyResetTriggerWidth = width;
    }

    /**
     * Returns True if the browser width has increased past the point where new images should be loaded
     */
    private _resetNeeded(): boolean {
        console.log('_resetNeeded called');
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

    /**
     * Sets up Responsive / Lazy images
     * @param lazyDataAttribute
     */
    init(lazyDataAttribute) {
        console.log('LazyResponsiveImages init');
        this.responsiveImagesInit();              //setup responsive images.
        this.lazyLoadInit(lazyDataAttribute);         //setup Lazy Images.    Pass through the ClassName used to indicate a Lazy Image

        this.setupResizeListener();

    }

    private responsiveImagesInit() {
        console.log('responsiveImagesInit called');
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

    private lazyLoadInit(lazyDataAttribute) {
        console.log('lazyLoadInit called');
        //#### Setup Lazy Load ####
        if (this._lazyLoad == null) {

            this._lazyLoad = new lazyLoad({
                // data_src: 'src-lazy' //Data attribute storing the src url.
                data_src: lazyDataAttribute //Data attribute storing the src url.
            });
            //console.log('lazyLoad object created', lazyLoad);
        }

    }

    //#region window.resize 
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
    //#endregion

}


/*



class LazyResponsiveImagesLoader {
    
    init() {
        //Set up LazyResponsiveImages
        console.log('LazyResponsiveImages Setting Up');
        const myLazyResponsiveImages = new LazyResponsiveImages();
        myLazyResponsiveImages.init('src-lazy');                    //setup responsive images/Lazy Images. Pass through the ClassName used to indicate a Lazy Image


        //Listen for browser resize- Resets Lazy Images. If 100 images are on screeen and user changes screen width, we dont want to load 100 images again if they are off screen.
        window.addEventListener('resize', debounce(300, function (e) {
            console.log('resize');
            //Check if imges need resetting to lazy
            myLazyResponsiveImages.resetLazyStatus();
            //update prev screen width
            myLazyResponsiveImages.updatePrevScreenWidth();
        }));
    }
}


//Listen for browser resize
window.addEventListener('resize', debounce(300, function (e) {
    //Check if imges need resetting to lazy
    myLazyResponsiveImages.resetLazyStatus();
    //update prev screen width
    myLazyResponsiveImages.updatePrevScreenWidth();
}));

*/

export { LazyResponsiveImages };