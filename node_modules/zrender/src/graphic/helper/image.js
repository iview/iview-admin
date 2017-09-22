define(function (require) {

    var LRU = require('../../core/LRU');
    var globalImageCache = new LRU(50);

    var helper = {};

    /**
     * @param {string|HTMLImageElement|HTMLCanvasElement|Canvas} newImageOrSrc
     * @return {HTMLImageElement|HTMLCanvasElement|Canvas} image
     */
    helper.findExistImage = function (newImageOrSrc) {
        if (typeof newImageOrSrc === 'string') {
            var cachedImgObj = globalImageCache.get(newImageOrSrc);
            return cachedImgObj && cachedImgObj.image;
        }
        else {
            return newImageOrSrc;
        }
    };

    /**
     * Caution: User should cache loaded images, but not just count on LRU.
     * Consider if required images more than LRU size, will dead loop occur?
     *
     * @param {string|HTMLImageElement|HTMLCanvasElement|Canvas} newImageOrSrc
     * @param {HTMLImageElement|HTMLCanvasElement|Canvas} image Existent image.
     * @param {module:zrender/Element} [hostEl] For calling `dirty`.
     * @param {Function} [cb] params: (image, cbPayload)
     * @param {Object} [cbPayload] Payload on cb calling.
     * @return {HTMLImageElement|HTMLCanvasElement|Canvas} image
     */
    helper.createOrUpdateImage = function (newImageOrSrc, image, hostEl, cb, cbPayload) {
        if (!newImageOrSrc) {
            return image;
        }
        else if (typeof newImageOrSrc === 'string') {

            // Image should not be loaded repeatly.
            if ((image && image.__zrImageSrc === newImageOrSrc) || !hostEl) {
                return image;
            }

            // Only when there is no existent image or existent image src
            // is different, this method is responsible for load.
            var cachedImgObj = globalImageCache.get(newImageOrSrc);

            var pendingWrap = {hostEl: hostEl, cb: cb, cbPayload: cbPayload};

            if (cachedImgObj) {
                image = cachedImgObj.image;
                !isImageReady(image) && cachedImgObj.pending.push(pendingWrap);
            }
            else {
                !image && (image = new Image());
                image.onload = imageOnLoad;

                globalImageCache.put(
                    newImageOrSrc,
                    image.__cachedImgObj = {
                        image: image,
                        pending: [pendingWrap]
                    }
                );

                image.src = image.__zrImageSrc = newImageOrSrc;
            }

            return image;
        }
        // newImageOrSrc is an HTMLImageElement or HTMLCanvasElement or Canvas
        else {
            return newImageOrSrc;
        }
    };

    function imageOnLoad() {
        var cachedImgObj = this.__cachedImgObj;
        this.onload = this.__cachedImgObj = null;

        for (var i = 0; i < cachedImgObj.pending.length; i++) {
            var pendingWrap = cachedImgObj.pending[i];
            var cb = pendingWrap.cb;
            cb && cb(this, pendingWrap.cbPayload);
            pendingWrap.hostEl.dirty();
        }
        cachedImgObj.pending.length = 0;
    }

    var isImageReady = helper.isImageReady = function (image) {
        return image && image.width && image.height;
    };

    return helper;

});