"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_core_1 = require("cloudinary-core");
/**
 * Represents One instance of Cloudinary JS with Lazy Load function.
 */
class CloudinaryLazy {
    /**
     * Creates the instance of Cloudinary
     * @param options
     */
    constructor(options) {
        this.cloudinaryJs = new cloudinary_core_1.Cloudinary(options);
        console.log('CloudinaryLazy constructor called: ', this.cloudinaryJs);
    }
}
exports.CloudinaryLazy = CloudinaryLazy;
