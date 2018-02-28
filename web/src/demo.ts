﻿import { LazyResponsiveImages } from './cloudinary-lazy-responsive-images'       //import like this to force render of js without actually needing to create and use the class
import { LazyResponsiveImagesContainerSupport } from './cloudinary-lazy-responsive-images-scrolling-containers'
import * as debounce from 'throttle-debounce/debounce';

export class Demos {

    /**
     * 
     */
    demoLazyResponsiveImg() {
        //Load and Run Lazy Repsonive
        const myLazyResponsiveImages = new LazyResponsiveImages({ lazyDataAttribute: 'src-lazy' });
        //run setup function
        myLazyResponsiveImages.init();
    }


    /**
     * 
     */
    demoLazyResponsiveImgScrollingContainerSupport() {
        const myLazyResponsiveImagesContainerSupport = new LazyResponsiveImagesContainerSupport({
            lazyDataAttribute: 'src-lazy',
            lazyContainerClassName: 'lazy-container'
        });
        //run setup function
        myLazyResponsiveImagesContainerSupport.init();
    }

}



//var demo = new Demos();
//demo.demoLazyResponsiveImg();
//demo.demoLazyResponsiveImgScrollingContainerSupport();