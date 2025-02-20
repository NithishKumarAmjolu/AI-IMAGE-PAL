function crop(source, area, dpr, preserve_ratio, format, callback) {
    var top = area.y * dpr;
    var left = area.x * dpr;
    var width = area.w * dpr;
    var height = area.h * dpr;
    var w = preserve_ratio && dpr !== 1 ? width : area.w;
    var h = preserve_ratio && dpr !== 1 ? height : area.h;

    var canvas = null;
    var container = null;

    if (!canvas) {
        container = document.createElement('template');
        canvas = document.createElement('canvas');
        document.body.appendChild(container);
        container.appendChild(canvas);
    }

    canvas.width = w;
    canvas.height = h;

    var img = new Image();
    img.onload = () => {
        canvas.getContext('2d').drawImage(img, left, top, width, height, 0, 0, w, h);
        var dataUrl = canvas.toDataURL(`image/${format}`);
        
        // Log base64 representation
        console.log('Base64 Image:', dataUrl);
        
        // Show floating UI with OCR and chat options
        createFloatingUI(dataUrl);
        
        // Only call callback if it exists
        if (typeof callback === 'function') {
            callback(dataUrl);
        }
    };
    img.src = source;
}
