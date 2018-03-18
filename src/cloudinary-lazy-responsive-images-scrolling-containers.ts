/// <reference path="../node_modules/vanilla-lazyload/typings/lazyload.d.ts" />
/// <reference path="../node_modules/cloudinary-core/cloudinary-core.d.ts" />

import { LazyResponsiveImages, iClriSettings as isettingsBase } from './cloudinary-lazy-responsive-images';
import { LazyLoad } from './lazy/lazy-load';

/**
 * Extend the interface with custom property
 */
interface iClriSettings extends isettingsBase {
    lazyContainerClassName?: string
};

class LazyResponsiveImagesContainerSupport extends LazyResponsiveImages {


    protected _lazyLoadInstances: Array<LazyLoad> = [];

    protected _lazyContainerClassName: string = 'lazy-container';      //default 'lazy-container'


    constructor(options?: iClriSettings) {
        super(options);
        console.log('LazyResponsiveImagesContainerSupport (Extended class) constructor called', options);

        //add 
        this._lazyContainerClassName = options.lazyContainerClassName;
    }


    /**
     *  Sets up Lazy Load
     * @param lazyDataAttribute
     */
    protected lazyLoadInit() {


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
                    var oneLL = new LazyLoad({
                        container: el,
                        data_src: lazyDataAttribute, //Data attribute storing the src url.
                        threshold: lazyThreshold
                    });

                    // Push it in the lazyLoadInstances array to keep track of the instances                
                    lazyLoadArray.push(oneLL);
                }
            }

            //Images in Scrolling Container           
            // The "lazyLazy" instance of lazyload is used (kinda improperly)
            // to check when the Container divs enter the viewport


            //Create Lazy Load instance via th Lazy Load Factory
            var lazyLazy = new LazyLoad({
                threshold: this._threshold,
                elements_selector: '.' + this._lazyContainerClassName,
                callback_set: callback()   // When the .horzContainer div enters the viewport...
            });         

            //################### Normal imgaes with lazy load (images not in a scrolling container) ###############
            //select all images that are not in a container with class '.tm-bg--underlay-wrap' and data-src set.
            //add an extra class to these images
            //target only images with that new class 

            const fullDataAttibName: string = 'data-' + this._lazyDataAttribute;
            let lazyImagesArray = Array.prototype.slice.call(document.querySelectorAll('img[' + fullDataAttibName + ']'));                               //convert to an array 

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
            var myLazyLoad = new LazyLoad({
                data_src: this._lazyDataAttribute, //'src-lazy',
                elements_selector: '.lazy',
                threshold: this._threshold
            });

            //Add the LazyLoad instance to the array
            this._lazyLoadInstances.push(myLazyLoad);

            console.log('this._lazyLoadInstances', this._lazyLoadInstances);
            console.log('this._lazyLoadInstances myLazyLoad', myLazyLoad);

        }
    }
     

    /**
     * Updates all Lazy Load instances
     */
    protected updateLazyLoad() {

        console.log('updateLazyLoad called');
        for (var i = 0; i < this._lazyLoadInstances.length; i++) {
            console.log('updateLazyLoadInstances', this._lazyLoadInstances[i]);

            this._lazyLoadInstances[i].update();

        }
    }

}


export { isettingsBase, LazyResponsiveImagesContainerSupport, iClriSettings };

