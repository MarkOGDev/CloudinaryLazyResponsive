import * as cloudinaryJS from "cloudinary-core";



/**
 * Creates Cloudinary. 
 */
class CloudinaryFactory {

    public readonly Cloudinary: cloudinaryJS.Cloudinary = null;

    constructor(options?: cloudinaryJS.Configuration.Options) {
        this.Cloudinary = new cloudinaryJS.Cloudinary(options);
    }

}

export { CloudinaryFactory, cloudinaryJS }