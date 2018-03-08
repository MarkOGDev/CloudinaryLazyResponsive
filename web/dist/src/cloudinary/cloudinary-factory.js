"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinaryJS = require("cloudinary-core");
exports.cloudinaryJS = cloudinaryJS;
/**
 * Creates Cloudinary.
 */
class CloudinaryFactory {
    constructor(options) {
        this.Cloudinary = null;
        this.Cloudinary = new cloudinaryJS.Cloudinary(options);
    }
}
exports.CloudinaryFactory = CloudinaryFactory;
