"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinaryJS = require("../../node_modules/cloudinary-core/cloudinary-core.js");
exports.cloudinaryJS = cloudinaryJS;
/**
 * Creates Cloudinary.
 * NOT used yet.
 */
class CloudinaryFactory {
    constructor(options) {
        this.Cloudinary = null;
        this.Cloudinary = new cloudinaryJS.Cloudinary(options);
    }
}
exports.CloudinaryFactory = CloudinaryFactory;
