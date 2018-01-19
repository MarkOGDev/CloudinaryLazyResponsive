//import { LazyResponsiveImages } from './lazy-responsive-images'

import { LazyResponsiveImagesLoader } from './lazy-responsive-images'       //import like this to force render of js without actually needing to create and use the class
import * as debounce from 'throttle-debounce/debounce';



//Test here. in reality we could call this from the main script
const myLazyResponsiveImagesLoader = new LazyResponsiveImagesLoader();
myLazyResponsiveImagesLoader.init();
