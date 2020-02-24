import IMovieImgSessionObj from "../interfaces/app-types/IMovieImgSessionObj";

class CanvasImgDataConverter {
    private static CANVAS = document.createElement('canvas');
    private static CONTEXT = CanvasImgDataConverter.CANVAS.getContext && CanvasImgDataConverter.CANVAS.getContext('2d');

    public static makeMovieImgSessionObj(imgEl: HTMLImageElement): IMovieImgSessionObj | never {
        let canvas = CanvasImgDataConverter.CANVAS;
        let context = CanvasImgDataConverter.CONTEXT;

        if (!context) {
            throw new Error("canvas context not supported");
        }

        let blockSize = 5, // only visit every 5 pixels
            data, width, height,
            i = -4,
            length,
            rgb = {r: 0, g: 0, b: 0}, jpgData = '',
            count = 0;

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width  = canvas.width  = imgEl.naturalWidth  || imgEl.offsetWidth  || imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
            jpgData = canvas.toDataURL("image/jpeg", .1);
        } catch(e) {
            throw new Error(e);
        }

        length = data.data.length;

        while ( (i += blockSize * 4) < length ) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i+1];
            rgb.b += data.data[i+2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r/count);
        rgb.g = ~~(rgb.g/count);
        rgb.b = ~~(rgb.b/count);

        return {
            jpgData,
            averageColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
        };
    }
}

export default CanvasImgDataConverter;