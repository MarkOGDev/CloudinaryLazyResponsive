/// <reference path="../node_modules/vanilla-lazyload/typings/lazyload.d.ts" />
/// <reference path="../node_modules/cloudinary-core/cloudinary-core.d.ts" />

import { LazyResponsiveImages, isettings as isettingsBase } from './cloudinary-lazy-responsive-images';

 
/**
 * Extend the interface with custom property
 */
export interface isettings extends isettingsBase {
    lazyContainerClassName?: string
};

export class LazyResponsiveImagesContainerSupport extends LazyResponsiveImages {

    protected _lazyLoadInstances: Array<ILazyLoad> = [];

    protected _lazyContainerClassName: string = 'lazy-container';      //default 'lazy-container'



    constructor(options?: isettings) {
        super(options);
        console.log('LazyResponsiveImages constructor called', options);

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
    protected lazyLoadInit() {
        // this.lazyDataAttribute = lazyDataAttribute;

        console.log('lazyLoadInit called', this._lazyDataAttribute);
        console.log('this.lazyContainorClassName', this._lazyContainerClassName);
        //#### Setup Lazy Load ####
        if (this._lazyLoadInstances.length == 0) {

            //############ Set up scrolling conatiner LazyLoad ############
            //get class properties into Scope
            var lazyLoadArray = this._lazyLoadInstances;
            var lazyDataAttribute = this._lazyDataAttribute;

            //## define the calback here so that 'this' is in scope.     
            function callback() {
                return function (el) {
                    console.log('callback()', el);

                    var oneLL = LazyResponsiveImages.lazyLoadProvider({
                        container: el,
                        data_src: lazyDataAttribute     //'src-lazy'
                    });

                    // Push it in the lazyLoadInstances array to keep track of the instances                
                    lazyLoadArray.push(oneLL);
                    //console.log('Callback _lazyLoadInstances', lazyLoadArray);
                }
            }

            //Images in Scrolling Container           
            // The "lazyLazy" instance of lazyload is used (kinda improperly)
            // to check when the Container divs enter the viewport
            var lazyLazy = LazyResponsiveImages.lazyLoadProvider({
                elements_selector: '.' + this._lazyContainerClassName,
                // When the .horzContainer div enters the viewport...
                callback_set: callback()
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
            var myLazyLoad = LazyResponsiveImages.lazyLoadProvider({
                data_src: this._lazyDataAttribute, //'src-lazy',
                elements_selector: '.lazy',
            });
            //Add the LazyLoad instance to the array
            this._lazyLoadInstances.push(myLazyLoad);
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
        //console.log('_lazyLoadInstances length', this._lazyLoadInstances.length);
    }


}


//export { LazyResponsiveImagesContainerSupport };

