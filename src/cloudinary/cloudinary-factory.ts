import { Cloudinary, Configuration, Util } from 'cloudinary-core';

/**
 * Createsa new instance of Cloudinary Core
 */
class CloudinaryFactory {


    public static getCloudinary(options: Configuration.Options) {
        //Set up Cloudinary
        return new Cloudinary(options);
    }

}

export { CloudinaryFactory, Cloudinary, Configuration, Util }