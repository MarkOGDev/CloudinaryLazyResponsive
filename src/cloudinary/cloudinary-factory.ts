 
import * as cloudinaryJS from "../../node_modules/cloudinary-core/cloudinary-core.js";

 

/**
 * Creates Cloudinary. 
 * NOT used yet.
 */
class CloudinaryFactory {

    public readonly Cloudinary: cloudinaryJS.Cloudinary = null;

    constructor(options?: cloudinaryJS.Configuration.Options) {
        this.Cloudinary = new cloudinaryJS.Cloudinary(options);
    }

}

export { CloudinaryFactory, cloudinaryJS }