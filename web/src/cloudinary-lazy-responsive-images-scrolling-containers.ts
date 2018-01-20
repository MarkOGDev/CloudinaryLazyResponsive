﻿/// <reference path="../node_modules/vanilla-lazyload/typings/lazyload.d.ts" />
/// <reference path="../node_modules/cloudinary-core/cloudinary-core.d.ts" />

import * as cloudinaryJS from "cloudinary-core"; import * as lazyLoad from 'vanilla-lazyload';
import * as inViewPort from 'in-viewport';
import { LazyResponsiveImages } from './cloudinary-lazy-responsive-images';


class LazyResponsiveImagesContainerSupport extends LazyResponsiveImages {

    //    private _lazyLoad: ILazyLoad = null;
    protected _lazyLoadInstances: Array<ILazyLoad> = [];

    public lazyContainorClassName: string;

    constructor() {

        //create base class
        super();

        // this._lazyContainorClassName = lazyContainorClassName;

    }


    //override the base class functions 


    protected lazyLoadInit(lazyDataAttribute: string) {
        console.log('lazyLoadInit called', lazyDataAttribute);
        console.log('this.lazyContainorClassName', this.lazyContainorClassName);
        //#### Setup Lazy Load ####
        if (this._lazyLoadInstances.length == 0) {


            //############ Set up scrolling conatiner LazyLoad ############
            var lazyLoadArray = this._lazyLoadInstances;

            //## define the calback here so that this is in scope.
            function callback() {
                return function (el) {
                    var oneLL = new lazyLoad({
                        container: el,
                        //elements_selector: '.bgimg1',     we dont need to specify a class name. data-src-lazy indicates that it is a lazy image
                        data_src: lazyDataAttribute     //'src-lazy'
                    });

                    // Optionally push it in the lazyLoadInstances
                    // array to keep track of the instances                
                    lazyLoadArray.push(oneLL);
                    console.log('Callback _lazyLoadInstances', lazyLoadArray);
                }
            }

            //Images in Scrolling Container
            //For Our Special Bg Images: These images are a always in the view port. So we need to only load them when their scrolling container is in/near viewport
            //See: https://github.com/verlok/lazyload#lazy-lazyload
            // var lazyLoadInstances = [];
            // The "lazyLazy" instance of lazyload is used (kinda improperly)
            // to check when the Container divs enter the viewport
            var lazyLazy = new lazyLoad({
                elements_selector: '.' + this.lazyContainorClassName, //'.lazy-container',
                // When the .horzContainer div enters the viewport...
                callback_set: callback()
            });



            //################### Normal imgaes with lazy load ###############
            //select all images that are not in a container with class '.tm-bg--underlay-wrap' and data-src set.
            //add an extra class to these images
            //target only images with that new class 


            const fullDataAttibName: string = 'data-' + lazyDataAttribute;
            let lazyImagesArray = Array.prototype.slice.call(document.querySelectorAll('img[' + fullDataAttibName + ']'));                               //convert to an array 

            const lazyContainerImagesArray = Array.prototype.slice.call(document.querySelectorAll('.' + this.lazyContainorClassName + ' img[' + fullDataAttibName + ']'));

            // const lazyContainerImagesArray = Array.prototype.slice.call(document.querySelectorAll('.lazy-container img[' + fullDataAttibName + ']'));



            //filter the array to get Lazy Images not in a scrolling container
            var lazyImagesWithoutContainer = lazyImagesArray.filter(function (obj) {
                return lazyContainerImagesArray.indexOf(obj) == -1;
            });

            console.log('lazyImagesArray', lazyImagesArray);
            console.log('lazyContainerImagesArray', lazyContainerImagesArray);
            console.log('nonLazyContainerImages1', lazyImagesWithoutContainer);



            for (var i = 0; i < lazyImagesWithoutContainer.length; i++) {
                //add extra class to help Target these Lazy images
                lazyImagesWithoutContainer[i].className += ' lazy';
            }

            //set up lazy load to work on images with class 'lazy'
            var myLazyLoad = new lazyLoad({
                data_src: lazyDataAttribute, //'src-lazy',
                elements_selector: '.lazy',
            });
            //Add the normal LazyLoad instance to the array
            this._lazyLoadInstances.push(myLazyLoad);

        }
    }


    protected updateLazyLoad() {
        console.log('updateLazyLoad called');
        for (var i = 0; i < this._lazyLoadInstances.length; i++) {
            console.log('updateLazyLoadInstances', this._lazyLoadInstances[i]);
            this._lazyLoadInstances[i].update();
        }
    }

 

    protected updateLazyLoadInstances() {
        for (var i = 0; i < this._lazyLoadInstances.length; i++) {
            console.log('updateLazyLoadInstances', this._lazyLoadInstances[i]);
            this._lazyLoadInstances[i].update();
        }
    }

    /**
 * used by window.resize
 * Rest Lazy images to Not loaded if off screen. If 100 images are on screeen and user changes screen width, we dont want to load 100 images again if they are off screen.
 */
    protected  resetLazyStatus() {

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
            // this._lazyLoad.update();
            this.updateLazyLoadInstances();

            //update ImageReloadTriggerWidth
            this.updateLazyResetTriggerWidth();

        }
    }


}



//var clri = new LazyResponsiveImagesContainerSupport();
////run setup function
//clri.init('src-lazy');



export { LazyResponsiveImagesContainerSupport };
































///// <reference path="../node_modules/vanilla-lazyload/typings/lazyload.d.ts" />
///// <reference path="../node_modules/cloudinary-core/cloudinary-core.d.ts" />

//import * as cloudinaryJS from "cloudinary-core";
//import * as debounce from 'throttle-debounce/debounce';
//import * as inViewPort from 'in-viewport';
//import * as lazyLoad from 'vanilla-lazyload';
//import * as viewportSize from 'viewport-size';   //https://github.com/jarvys/viewportSize



///*

//First Page Load:
//Load Cloudinory Images
//Call Cloudinory Responsive function
//Any lazy images will not be loaded, their data will be updated by Cloudinory Responsive function

//OnResize:
//for Each Lazy Image:
//    if Resize Needed and:
//        off screen: remove src. Force Cloudinory to update attribute data-src-lazy.

//        on screen: let Cloudinory update attribute src. 
//*/


//// #region - Override cloudinary-core Util functions

////cloudinaryJS.Util.setAttribute = function (element, name, value) {
////    //See if image is in view port.
////     const isInViewPort = inViewPort(element, { offset: 300 });    

////    if (!isInViewPort && name == 'src') //make lazy (not in view port)
////    {
////        name = 'data-src-lazy';
////    }

////    switch (false) {
////        case !(element == null):
////            return void 0;
////        case !cloudinaryJS.Util.isFunction(element.setAttribute):
////            return element.setAttribute(name, value);
////    }
////};

//// #endregion

//interface scrollingContainerClassInfo {
//    [constainerClassName: string]: string;
//}


//class LazyResponsiveImages {

//    private _cloudinary: cloudinaryJS.Cloudinary = null;
//    private _bodyElement: Element = null;
//    private _cloudImgHtmlTags: NodeListOf<Element> = null;
//    private _lazyLoad: ILazyLoad = null;
//    private _lazyLoadInstances: Array<ILazyLoad> = [];


//    private _prevScreenWidth: number = null;
//    private _lazyResetTriggerWidth: number = null;

//    //Key/Value pair Map/Dictionary
//    images: Map<string, string> = new Map<string, string>();

//    // map: scrollingContainerClassInfo = {};

//    la() {

//        this.images.set('sdas', 'dafdf');
//    }


//    // private _imageInScrollingContainerClassName: { [id: string]: string; } = {};        //tyescript dictionary. Immutable Like c#: The dictionary itself is not immutable. But you cannot change the dictionary while enumerating it in the foreach-loop.
//    // get ScrollingContainerClassNames(): { [id: string]: string; } {

//    //    this._imageInScrollingContainerClassName[0] = { id: 'dssd',  sd: 'dsdsd' };
//    //    return this._imageInScrollingContainerClassName;

//    //}
//    //set ScrollingContainerClassNames(value: { [id: string]: string; }) {

//    //    this._bar = theBar;

//    //}

//    //ImageInScrollingContainerClassName



//    constructor() {

//        this.modifyCloudinarySetAttribute();


//        //Display viewport dimension on the page.
//        const info = document.getElementById('info');
//        info.innerText = viewportSize.getWidth() + ' * ' + viewportSize.getHeight();

//    }

//    private modifyCloudinarySetAttribute() {


//        // #region - Override cloudinary-core Util functions

//        cloudinaryJS.Util.setAttribute = function (element, name, value) {
//            console.log('cloudinaryJS.Util.setAttribute called');

//            //See if image is in view port.
//            //Some images are in a scrolling container. e.g. our fullscreen background images. 'This is our use case'
//            //inthat case we should check if both are on screen. 
//            //check both incase the container is a div with scrollbar etc. 'this is an untested use case' but could work nicely with the lazy lib bacause it too supports a div with scroll bar coataining images. 




//            //## Do this custom BAckground bit in another file.
//            //keep this one for publishing to git hub


//            //LazyResponsiveImgSupportCustomBGs



//            //responsive Lazy images
//            //add some to the html in the scroling div and outside it.
//            //if element in scrolling div, check if container is inviewport. 





//            //ho do we know that an image is in a container. We will have to check its attributes for an indicator.
//            //for our special bg images we can look for that class.
//            //for other use cases we could look for a different class???? 

//            let isInViewPort: boolean = null;

//            element.className.indexOf('tm-bg--img');    //our special class for full screen backgrounds in a scrolling div. the img is always in the viewport so we need ot look at htis element instead.
//            //we need the container class too.

//            isInViewPort = inViewPort(element, { offset: 300 });        //offset is 300. Same a s Lazy load default.



//            console.log('isInViewPort', isInViewPort);

//            //const isInViewPort = inViewPort(element, { offset: 300 });
















//            if (!isInViewPort && name == 'src') //make lazy (not in view port)
//            {
//                name = 'data-src-lazy';
//            }

//            switch (false) {
//                case !(element == null):
//                    return void 0;
//                case !cloudinaryJS.Util.isFunction(element.setAttribute):
//                    return element.setAttribute(name, value);
//            }
//        };

//        // #endregion

//    }


//    private getviewportWidth() {
//        return viewportSize.getWidth();
//    }

//    /**
//     * used by window.resize 
//     */
//    updatePrevScreenWidth() {
//        this._prevScreenWidth = this.getviewportWidth();
//    }

//    private updateLazyResetTriggerWidth() {
//        //round up to nearest 100.  
//        const width = Math.ceil(this.getviewportWidth() / 100) * 100;
//        this._lazyResetTriggerWidth = width;
//    }

//    private updateLazyLoadInstances() {
//        for (var i = 0; i < this._lazyLoadInstances.length; i++) {
//            console.log('updateLazyLoadInstances', this._lazyLoadInstances[i]);
//            this._lazyLoadInstances[i].update();
//        }
//    }

//    /**
//     * Returns True if the browser width has increased past the point where new images should be loaded
//     */
//    private _resetNeeded(): boolean {

//        const currentScreenWidth = this.getviewportWidth();
//        console.log('currentScreenWidth', currentScreenWidth);


//        const screenGotBigger = currentScreenWidth > this._prevScreenWidth;
//        console.log('screenGotBigger', screenGotBigger);
//        console.log('this.prevScreenWidth', this._prevScreenWidth);
//        if (!screenGotBigger) {
//            return false;
//        }

//        const screenWidthBiggerThanTriggerWidth = currentScreenWidth > this._lazyResetTriggerWidth;
//        console.log('screenWidthBiggerThanTriggerWidth', screenWidthBiggerThanTriggerWidth);
//        console.log('this.lazyResetTriggerWidth', this._lazyResetTriggerWidth);

//        if (!screenWidthBiggerThanTriggerWidth) {
//            return false;
//        }
//        else {
//            return true;
//        }

//    }

//    /**
//     * used by window.resize
//     * Rest Lazy images to Not loaded if off screen. If 100 images are on screeen and user changes screen width, we dont want to load 100 images again if they are off screen.
//     */
//    resetLazyStatus() {

//        if (this._resetNeeded()) {

//            //Get All Lazy img tags 
//            this._cloudImgHtmlTags = document.querySelectorAll('img[data-src-lazy]');
//            // console.log('_cloudImgHtmlTags', this._cloudImgHtmlTags);

//            for (var i = 0; i < this._cloudImgHtmlTags.length; i++) {

//                //If not in view port then make LazyLoad manage the image by removing the Attribute data-was-processed
//                const isInViewPort = inViewPort(this._cloudImgHtmlTags[i], { offset: 300 });
//                if (!isInViewPort) {
//                    //LAZYLOAD: remove data-was-processed="true" so that Lazy Load knows the image is fresh
//                    this._cloudImgHtmlTags[i].removeAttribute('data-was-processed');
//                }
//            }

//            //tell LazyLoad to manage the images that we have just reset.
//            // this._lazyLoad.update();
//            this.updateLazyLoadInstances();

//            //update ImageReloadTriggerWidth
//            this.updateLazyResetTriggerWidth();

//        }
//    }

//    /**
//     * Sets up Responsive / Lazy images
//     * @param lazyDataAttribute
//     */
//    init(lazyDataAttribute) {
//        this.responsiveImagesInit();              //setup responsive images.
//        this.lazyLoadInit(lazyDataAttribute);         //setup Lazy Images.    Pass through the ClassName used to indicate a Lazy Image

//        this.setupResizeListener();
//    }

//    private responsiveImagesInit() {

//        //Setup Cloudinory Responsive JS
//        //https://cloudinary.com/documentation/responsive_images#automating_responsive_images_with_javascript

//        if (this._cloudinary == null) {
//            this._cloudinary = new cloudinaryJS.Cloudinary({ cloud_name: "demo" });
//            //Setup Responsive images.  
//            this._cloudinary.responsive();
//        }

//        //set the initial screen width values 
//        this.updatePrevScreenWidth();
//        this.updateLazyResetTriggerWidth();

//    }

//    private lazyLoadInit(lazyDataAttribute: string) {

//        //#### Setup Lazy Load ####
//        if (this._lazyLoadInstances.length == 0) {


//            //############ Set up scrolling conatiner LazyLoad ############
//            var lazyLoadArray = this._lazyLoadInstances;

//            //## define the calback here so that this is in scope.
//            function callback() {
//                return function (el) {
//                    var oneLL = new lazyLoad({
//                        container: el,
//                        //elements_selector: '.bgimg1',     we dont need to specify a class name. data-src-lazy indicates that it is a lazy image
//                        data_src: lazyDataAttribute     //'src-lazy'
//                    });

//                    // Optionally push it in the lazyLoadInstances
//                    // array to keep track of the instances                
//                    lazyLoadArray.push(oneLL);
//                    console.log('Callback _lazyLoadInstances', lazyLoadArray);
//                }
//            }

//            //Images in Scrolling Container
//            //For Our Special Bg Images: These images are a always in the view port. So we need to only load them when their scrolling container is in/near viewport
//            //See: https://github.com/verlok/lazyload#lazy-lazyload
//            // var lazyLoadInstances = [];
//            // The "lazyLazy" instance of lazyload is used (kinda improperly)
//            // to check when the Container divs enter the viewport
//            var lazyLazy = new lazyLoad({
//                elements_selector: '.lazy-container',
//                // When the .horzContainer div enters the viewport...
//                callback_set: callback()
//            });



//            //################### Normal imgaes with lazy load ###############
//            //select all images that are not in a container with class '.tm-bg--underlay-wrap' and data-src set.
//            //add an extra class to these images
//            //target only images with that new class 

//            //  let lazyImagesArray = Array.prototype.slice.call(document.querySelectorAll('img[data-src-lazy]'));                               //convert to an array 
//            //  const lazyContainerImagesArray = Array.prototype.slice.call(document.querySelectorAll('.lazy-container img[data-src-lazy]'));

//            const fullDataAttibName: string = 'data-' + lazyDataAttribute;

//            let lazyImagesArray = Array.prototype.slice.call(document.querySelectorAll('img[' + fullDataAttibName + ']'));                               //convert to an array 
//            const lazyContainerImagesArray = Array.prototype.slice.call(document.querySelectorAll('.lazy-container img[' + fullDataAttibName + ']'));



//            //filter the array to get Lazy Images not in a scrolling container
//            var lazyImagesWithoutContainer = lazyImagesArray.filter(function (obj) {
//                return lazyContainerImagesArray.indexOf(obj) == -1;
//            });

//            console.log('lazyImagesArray', lazyImagesArray);
//            console.log('lazyContainerImagesArray', lazyContainerImagesArray);
//            console.log('nonLazyContainerImages1', lazyImagesWithoutContainer);


//            // var test = document.querySelectorAll('img[data-src-lazy]');
//            //.log('test', test);


//            for (var i = 0; i < lazyImagesWithoutContainer.length; i++) {
//                //add extra class to help Target these Lazy images
//                lazyImagesWithoutContainer[i].className += ' lazy';
//            }

//            //set up lazy load to work on images with class 'lazy'
//            var myLazyLoad = new lazyLoad({
//                data_src: lazyDataAttribute, //'src-lazy',
//                elements_selector: '.lazy',
//            });
//            //Add the normal LazyLoad instance to the array
//            this._lazyLoadInstances.push(myLazyLoad);



//            //this._lazyLoad = new lazyLoad({
//            //    // data_src: 'src-lazy' //Data attribute storing the src url.
//            //    data_src: className //Data attribute storing the src url.
//            //});
//            //console.log('lazyLoad object created', lazyLoad);
//        }

//    }

//    //#region window.resize 

//    setupResizeListener() {
//        console.log();

//        //## define the calback here so that 'this' instance is in scope.
//        function callback() {
//            return function () {
//                debounce(300, function () {
//                    console.log('resize');
//                    //Check if imges need resetting to lazy
//                    this.resetLazyStatus();
//                    //update prev screen width
//                    this.updatePrevScreenWidth();
//                })
//            }
//        }

//        //Listen for browser resize- Resets Lazy Images. If 100 images are on screeen and user changes screen width, we dont want to load 100 images again if they are off screen.
//        window.addEventListener('resize', callback());


//    }

//    //#endregion
//}



///**
// * Sets up Lazy Responsive Images
// */
//class LazyResponsiveImagesLoader {
//    /**
//     * Sets up LazyResponsiveImages
//     */
//    init() {
//        //Set up LazyResponsiveImages
//        console.log('cloudinaryLazyResponsiveImagesScrollingContainers LazyResponsiveImages Setting Up');
//        const myLazyResponsiveImages = new LazyResponsiveImages();
//        myLazyResponsiveImages.init('src-lazy');                    //setup responsive images/Lazy Images. Pass through the ClassName used to indicate a Lazy Image


//        //Listen for browser resize- Resets Lazy Images. If 100 images are on screeen and user changes screen width, we dont want to load 100 images again if they are off screen.
//        window.addEventListener('resize', debounce(300, function (e) {
//            console.log('resize');
//            //Check if imges need resetting to lazy
//            myLazyResponsiveImages.resetLazyStatus();
//            //update prev screen width
//            myLazyResponsiveImages.updatePrevScreenWidth();
//        }));
//    }
//}

