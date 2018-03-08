"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_lazy_responsive_images_1 = require("./cloudinary-lazy-responsive-images"); //import like this to force render of js without actually needing to create and use the class
const cloudinary_lazy_responsive_images_scrolling_containers_1 = require("./cloudinary-lazy-responsive-images-scrolling-containers");
class Demos {
    /**
     *
     */
    demoLazyResponsiveImg() {
        //Load and Run Lazy Repsonive
        const myLazyResponsiveImages = new cloudinary_lazy_responsive_images_1.LazyResponsiveImages({ lazyDataAttribute: 'src-lazy' });
        //run setup function
        myLazyResponsiveImages.init();
    }
    /**
     *
     */
    demoLazyResponsiveImgScrollingContainerSupport() {
        const myLazyResponsiveImagesContainerSupport = new cloudinary_lazy_responsive_images_scrolling_containers_1.LazyResponsiveImagesContainerSupport({
            lazyDataAttribute: 'src-lazy',
            lazyContainerClassName: 'lazy-container'
        });
        //run setup function
        myLazyResponsiveImagesContainerSupport.init();
    }
}
exports.Demos = Demos;
//var demo = new Demos();
//demo.demoLazyResponsiveImg();
//demo.demoLazyResponsiveImgScrollingContainerSupport(); 
