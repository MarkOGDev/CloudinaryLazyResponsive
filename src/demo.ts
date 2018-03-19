//import { LazyResponsiveImages } from './cloudinary-lazy-responsive-images'

import { CloudinaryLazyResponsive } from './cloudinary/cloudinary-lazy-responsive';
import { CloudinaryLazyResponsiveScrollingContainerSupport } from './/cloudinary/cloudinary-lazy-responsive-with-scrolling-container-support';


//import { LazyResponsiveImagesContainerSupport } from './cloudinary-lazy-responsive-images-scrolling-containers'





export class Demos {

    /**
     * Demo of Cloudinary Lazy Responsive 
     */
    demoLazyResponsiveImg() {

        //Create new CloudinaryLazyResponsive and Init.
        const myCloudinaryLazyResponsive = new CloudinaryLazyResponsive({
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



        const myCloudinaryLazyResponsiveScrollingContainerSupport = new CloudinaryLazyResponsiveScrollingContainerSupport({
            cloudinaryOptions: { cloud_name: 'demo'},
            lazyLoadOptions: {
                data_src: 'src-lazy',
                threshold: 600,
                container: 'lazy-container'
            }
        });

        //Run init method
        myCloudinaryLazyResponsiveScrollingContainerSupport.init(); 
    }

}

