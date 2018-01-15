# Cloudinary Lazy Responsive Images

This is related to CloudinaryJS Responsive Images. NOT HTML5 responsive img tag with srcset.

**What this does:**

Make Cloudinary Responsive Images **Load lazily**

**Why:**

Cloudinary has a good responsive feature but it loads images instantly. If we load them lazily we can save bandwidth.

**How:**
 
I have Modified CloudinoryJS **setAttribute** function to update attribute **data-src-lazy** rather than **src** when 'element' has class **LazyLoad**

This means that the image will not load instantly.

Now a LazyLoad lib can manage the image loading rather than have all images load when the page loads.

 
#### Example
Normal Responsive Cloudinory Image 
```html 
<img class="cld-responsive" data-src="https://res.cloudinary.com/demo/image/upload/w_auto,c_scale/sample.jpg" />
```
Lazy Responsive Cloudinory Image 
```html 
<img class="cld-responsive" data-src-lazy="https://res.cloudinary.com/demo/image/upload/w_auto,c_scale/sample.jpg" />
```