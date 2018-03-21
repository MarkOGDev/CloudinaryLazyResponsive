"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_core_1 = require("cloudinary-core");
exports.Cloudinary = cloudinary_core_1.Cloudinary;
exports.Configuration = cloudinary_core_1.Configuration;
exports.Util = cloudinary_core_1.Util;
/**
 * Createsa new instance of Cloudinary Core
 */
class CloudinaryFactory {
    static getCloudinary(options) {
        //Set up Cloudinary
        return new cloudinary_core_1.Cloudinary(options);
    }
}
exports.CloudinaryFactory = CloudinaryFactory;
