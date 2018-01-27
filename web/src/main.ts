//import { LazyResponsiveImages } from './lazy-responsive-images'

import { LazyResponsiveImages } from './cloudinary-lazy-responsive-images'       //import like this to force render of js without actually needing to create and use the class
import * as debounce from 'throttle-debounce/debounce';
 


//Load and Run Lazy Repsonive
const myLazyResponsiveImages = new LazyResponsiveImages({ lazyDataAttribute: 'src-lazy' });
myLazyResponsiveImages.init();


