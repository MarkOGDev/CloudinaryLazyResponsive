
import {
    // getHeight as viewportSizeGetHeight,
    getWidth as viewportSizeGetWidth
} from 'viewport-size';                                     //https://github.com/jarvys/viewportSize
import * as  inViewPort from 'in-viewport';                 //https://github.com/vvo/in-viewport 


class ClientHelpers {

    /**
    * Returns true if element near or in viewport
    * @param element
    */
    public static isElementInViewPort(element: Element, elementOffset: number) {
        const result = inViewPort(element, { offset: elementOffset });
        console.log('isElementInViewPort()', result);
        return result;
    }


    /**
     * Returns the Viewport width
     */
    public static getViewportWidth() {
        const width = viewportSizeGetWidth();
        console.log('getViewportWidth()', width);
        return width;
    }



    public static promiseSupported() {
        let supported = false;

        //Chck for Promise support. If none load the polyfill
        if (typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1) {
            supported = true;
        }

        return supported;
    }


}

export { ClientHelpers }