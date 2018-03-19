import { Configuration } from 'cloudinary-core';
import { ILazyLoadOptions } from './../lazy/ilazy-load-options';

/**
 * Cloudinary Lazy Options Interface
 * 
 */
interface ICloudinaryLazyOptions {
    cloudinaryOptions?: Configuration.Options,
    lazyLoadOptions?: ILazyLoadOptions;
}

export { ICloudinaryLazyOptions }