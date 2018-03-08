"use strict";
/// <reference path="../node_modules/vanilla-lazyload/typings/lazyload.d.ts" />
/// <reference path="../node_modules/cloudinary-core/cloudinary-core.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_lazy_responsive_images_1 = require("./cloudinary-lazy-responsive-images");
//import {
//    LazyLoadFactory
//    //, lazyLoad, lazyLoad8
//} from './lazy/lazy-load-factory';
const lazy_load_1 = require("./lazy/lazy-load");
;
class LazyResponsiveImagesContainerSupport extends cloudinary_lazy_responsive_images_1.LazyResponsiveImages {
    // private _threshold = 600;
    constructor(options) {
        super(options);
        //  protected _lazyLoadInstances: Array<ILazyLoad> = [];
        // protected _lazyLoadInstances: Array<Promise<ILazyLoad>> = [];
        this._lazyLoadInstances = [];
        this._lazyContainerClassName = 'lazy-container'; //default 'lazy-container'
        console.log('LazyResponsiveImagesContainerSupport (Extended class) constructor called', options);
        //add 
        this._lazyContainerClassName = options.lazyContainerClassName;
    }
    //  public lazyDataAttribute: string;
    //constructor() {
    //    //create base class
    //    super();
    //}
    /**
     *  Sets up Lazy Load
     * @param lazyDataAttribute
     */
    lazyLoadInit() {
        console.log('lazyLoadInit called', this._lazyDataAttribute);
        console.log('this.lazyContainorClassName', this._lazyContainerClassName);
        //#### Setup Lazy Load ####
        if (this._lazyLoadInstances.length == 0) {
            //############ Set up scrolling conatiner LazyLoad ############
            //get class properties into Scope
            var lazyLoadArray = this._lazyLoadInstances;
            var lazyDataAttribute = this._lazyDataAttribute;
            var lazyThreshold = this._threshold;
            //## define the calback here so that 'this' is in scope in the lines above. We can copy data from 'this' and pass it to th call back which will run onside of 'this' scope.   
            function callback() {
                return function (el) {
                    console.log('callback()', el);
                    //Create Lazy Load instance via th Lazy Load Factory
                    var oneLL = new lazy_load_1.LazyLoad({
                        container: el,
                        data_src: lazyDataAttribute,
                        threshold: lazyThreshold
                    });
                    // Push it in the lazyLoadInstances array to keep track of the instances                
                    lazyLoadArray.push(oneLL);
                    ////Create Lazy Load instance via th Lazy Load Factory
                    //var oneLL = LazyLoadFactory.getLazyLoad({
                    //    container: el,
                    //    data_src: lazyDataAttribute, //Data attribute storing the src url.
                    //    threshold: lazyThreshold
                    //});
                    //// Push it in the lazyLoadInstances array to keep track of the instances                
                    //lazyLoadArray.push(oneLL);
                    //console.log('Callback _lazyLoadInstances', lazyLoadArray);
                };
            }
            //Images in Scrolling Container           
            // The "lazyLazy" instance of lazyload is used (kinda improperly)
            // to check when the Container divs enter the viewport
            //Create Lazy Load instance via th Lazy Load Factory
            var lazyLazy = new lazy_load_1.LazyLoad({
                threshold: this._threshold,
                elements_selector: '.' + this._lazyContainerClassName,
                callback_set: callback() // When the .horzContainer div enters the viewport...
            });
            //var lazyLazy = LazyResponsiveImages.lazyLoadProvider({
            //    elements_selector: '.' + this._lazyContainerClassName,
            //    // When the .horzContainer div enters the viewport...
            //    callback_set: callback()
            //});
            //################### Normal imgaes with lazy load (images not in a scrolling container) ###############
            //select all images that are not in a container with class '.tm-bg--underlay-wrap' and data-src set.
            //add an extra class to these images
            //target only images with that new class 
            const fullDataAttibName = 'data-' + this._lazyDataAttribute;
            let lazyImagesArray = Array.prototype.slice.call(document.querySelectorAll('img[' + fullDataAttibName + ']')); //convert to an array 
            const lazyContainerImagesArray = Array.prototype.slice.call(document.querySelectorAll('.' + this._lazyContainerClassName + ' img[' + fullDataAttibName + ']'));
            //console.log('lazyContainerImagesArray', lazyContainerImagesArray);
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
            //Create Lazy Load instance via th Lazy Load Factory
            var myLazyLoad = new lazy_load_1.LazyLoad({
                data_src: this._lazyDataAttribute,
                elements_selector: '.lazy',
                threshold: this._threshold
            });
            //var myLazyLoad = LazyResponsiveImages.lazyLoadProvider({
            //    data_src: this._lazyDataAttribute, //'src-lazy',
            //    elements_selector: '.lazy',
            //});
            //Add the LazyLoad instance to the array
            this._lazyLoadInstances.push(myLazyLoad);
            console.log('this._lazyLoadInstances', this._lazyLoadInstances);
            console.log('this._lazyLoadInstances myLazyLoad', myLazyLoad);
        }
    }
    /**
     * Updates all Lazy Load instances
     */
    updateLazyLoad() {
        console.log('updateLazyLoad called');
        for (var i = 0; i < this._lazyLoadInstances.length; i++) {
            console.log('updateLazyLoadInstances', this._lazyLoadInstances[i]);
            this._lazyLoadInstances[i].update();
            //call update LazyLoad Via the LazyLoad Promise
            //this._lazyLoadInstances[i].then(lazyLoad => {
            //    //call update
            //    lazyLoad.update();
            //});
            //this._lazyLoadInstances[i].update();
        }
        //console.log('_lazyLoadInstances length', this._lazyLoadInstances.length);
    }
}
exports.LazyResponsiveImagesContainerSupport = LazyResponsiveImagesContainerSupport;
