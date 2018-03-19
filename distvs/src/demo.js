"use strict";
//import { LazyResponsiveImages } from './cloudinary-lazy-responsive-images'
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_lazy_responsive_1 = require("./cloudinary/cloudinary-lazy-responsive");
const cloudinary_lazy_responsive_with_scrolling_container_support_1 = require(".//cloudinary/cloudinary-lazy-responsive-with-scrolling-container-support");
//import { LazyResponsiveImagesContainerSupport } from './cloudinary-lazy-responsive-images-scrolling-containers'
class Demos {
    /**
     * Demo of Cloudinary Lazy Responsive
     */
    demoLazyResponsiveImg() {
        //Create new CloudinaryLazyResponsive and Init.
        const myCloudinaryLazyResponsive = new cloudinary_lazy_responsive_1.CloudinaryLazyResponsive({
            cloudinaryOptions: { cloud_name: 'demo' },
            lazyLoadOptions: {
                data_src: 'src-lazy',
                threshold: 600
            }
        });
        //Run init method
        myCloudinaryLazyResponsive.init();
    }
    /**
     * Demo of yCloudinaryLazyResponsive With Scrolling Container Support
     */
    demoLazyResponsiveImgScrollingContainerSupport() {
        const myCloudinaryLazyResponsiveScrollingContainerSupport = new cloudinary_lazy_responsive_with_scrolling_container_support_1.CloudinaryLazyResponsiveScrollingContainerSupport({
            cloudinaryOptions: { cloud_name: 'demo' },
            lazyLoadOptions: {
                data_src: 'src-lazy',
                threshold: 600,
                container: 'lazy-container'
            }
        });
        //Run init method
        myCloudinaryLazyResponsiveScrollingContainerSupport.init();
        //const myLazyResponsiveImagesContainerSupport = new LazyResponsiveImagesContainerSupport({
        //    lazyDataAttribute: 'src-lazy',
        //    lazyContainerClassName: 'lazy-container'
        //});
        ////run setup function
        //myLazyResponsiveImagesContainerSupport.init();
    }
}
exports.Demos = Demos;
