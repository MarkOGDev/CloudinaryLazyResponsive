/*
 * A small selection of the options available for Lazy Load. We only need these ones for now,
 */
interface ILazyLoadOptions {
    /**
    *   The Data Attribute containing the Lazy load src.
    */
    data_src?: string;
    threshold?: number;
    container?: string;
     /**
        Optional Class Name to indicate element should be lazy loaded
    */
    elements_selector?: string;
    /**
     
    */
    callback_set?: any;

}

export { ILazyLoadOptions }