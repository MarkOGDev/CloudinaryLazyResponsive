import * as cloudinaryJS from "cloudinary-core";
/// <reference path="../node_modules/cloudinary-core/cloudinary-core.d.ts" />

/**
 * Class Settings Interface
 */
//interface iCloudinarySettings {
//    cloudinaryOptions?: cloudinaryJS.Configuration.Options,
//}


//TODO: make sure to separate client from server stuff. 
//ie. if referencing document then put those functions into a separate module.



class CloudinaryProvider {

   // protected _cloudinaryOptions: cloudinaryJS.Configuration.Options = { cloud_name: 'demo' };    //default options
    public Cloudinary: cloudinaryJS.Cloudinary = null;

    constructor(options?: cloudinaryJS.Configuration.Options) {
      //  this._cloudinaryOptions = options.cloudinaryOptions;
 
        this.Cloudinary = new cloudinaryJS.Cloudinary(options);
    } 

}

export { CloudinaryProvider, cloudinaryJS }