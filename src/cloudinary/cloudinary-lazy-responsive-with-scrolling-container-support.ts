﻿import { CloudinaryLazyResponsive, ICloudinaryLazyOptions } from './cloudinary-lazy-responsive';
import { LazyLoad } from './../lazy/lazy-load';


class CloudinaryLazyResponsiveScrollingContainerSupport extends CloudinaryLazyResponsive {


    protected _lazyLoadInstances: Array<LazyLoad> = [];

    // protected _lazyContainerClassName: string = 'lazy-container';      //default 'lazy-container'


    constructor(options?: ICloudinaryLazyOptions) {
        super(options);
        console.log('LazyResponsiveImagesContainerSupport (Extended class) constructor called', options);
 
    }


    /**
     *  Sets up Lazy Load
     * @param lazyDataAttribute
     */
    protected lazyLoadInit() { 
        console.log('lazyLoadInit called', this._options);

        //#### Setup Lazy Load ####
        if (this._lazyLoadInstances.length == 0) {

            //############ Set up scrolling conatiner LazyLoad ############
            //get class properties into Scope
            const lazyLoadArray = this._lazyLoadInstances;
            const lazyDataAttribute = this._options.lazyLoadOptions.data_src;
            const lazyThreshold = this._options.lazyLoadOptions.threshold;
            const lazyContainer = this._options.lazyLoadOptions.container;

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
                threshold: lazyThreshold,
                elements_selector: '.' + lazyContainer,
                callback_set: callback()   // When the .horzContainer div enters the viewport...
            });

            //################### Normal imgaes with lazy load (images not in a scrolling container) ###############
            //select all images that are not in a container with class '.tm-bg--underlay-wrap' and data-src set.
            //add an extra class to these images
            //target only images with that new class 

            const fullDataAttibName: string = 'data-' + lazyDataAttribute;
            let lazyImagesArray = Array.prototype.slice.call(document.querySelectorAll('img[' + fullDataAttibName + ']'));                               //convert to an array 

            const lazyContainerImagesArray = Array.prototype.slice.call(document.querySelectorAll('.' + lazyContainer + ' img[' + fullDataAttibName + ']'));
            //console.log('lazyContainerImagesArray', lazyContainerImagesArray);

            //filter the array to get Lazy Images not in a scrolling container
            var lazyImagesWithoutContainer = lazyImagesArray.filter(function (obj) {
                return lazyContainerImagesArray.indexOf(obj) == -1;
            });

            console.log('lazyImagesArray', lazyImagesArray);
            console.log('lazyContainerImagesArray', lazyContainerImagesArray);
            console.log('nonLazyContainerImages1', lazyImagesWithoutContainer);

            //Add the class .lazy to the Lazy images without container
            for (var i = 0; i < lazyImagesWithoutContainer.length; i++) {
                //add extra class to help Target these Lazy images
                lazyImagesWithoutContainer[i].className += ' lazy';
            }

            //set up lazy load to work on images with class 'lazy'
            //Create Lazy Load instance via th Lazy Load Factory
            var myLazyLoad = new LazyLoad({
                data_src: lazyDataAttribute,
                elements_selector: '.lazy',
                threshold: lazyThreshold
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


export { CloudinaryLazyResponsive, ICloudinaryLazyOptions, CloudinaryLazyResponsiveScrollingContainerSupport };

