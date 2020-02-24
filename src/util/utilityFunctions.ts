import IMovieResultItem from "../interfaces/app-types/IMovieResultItem";
import {ResultItemsObject} from "../interfaces/app-types/IMoviesSearchData";
import IMovieImgSessionObj from "../interfaces/app-types/IMovieImgSessionObj";
import appProperties from "../appProperties";
import CanvasImgDataConverter from "./CanvasImgDataConverter";
const {posterSrcPathPrefix} = appProperties;

export function wait(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export function isMobile() {
    return window.innerWidth < 600;
}

export function hslInterval(
    [h1, s1, l1]: [number, number, number],
    [h2, s2, l2]: [number, number, number],
    weight: number): [number, number, number] {
    // difference * weight
    const [h_toAdd, s_toAdd, l_toAdd] = [
        Math.abs(h1-h2) * weight,
        Math.abs(s1-s2) * weight,
        Math.abs(l1-l2) * weight,
    ];

    return [
        h1 < h2 ? h1 + h_toAdd : h1 - h_toAdd,
        s1 < s2 ? s1 + s_toAdd : s1 - s_toAdd,
        l1 < l2 ? l1 + l_toAdd : l1 - l_toAdd,
    ];
}

export function hslToHex([h, s, l]: [number, number, number]): string {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// export function getJpgDataAndAverageRGB(imgEl: HTMLImageElement): IMovieImgSessionObj | Error  {

    // let canvas = document.createElement('canvas');
    // let context = canvas.getContext && canvas.getContext('2d');
    // console.log("created new context");
    //
    // if (!context) {
    //     throw new Error("canvas context not supported");
    // }
    //
    // let blockSize = 5, // only visit every 5 pixels
    //     data, width, height,
    //     i = -4,
    //     length,
    //     rgb = {r: 0, g: 0, b: 0}, jpgData = '',
    //     count = 0;
    //
    //
    //
    // height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    // width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    //
    // context.drawImage(imgEl, 0, 0);
    //
    // try {
    //     data = context.getImageData(0, 0, width, height);
    //     jpgData = canvas.toDataURL("image/jpeg", .1);
    // } catch(e) {
    //     throw new Error(e);
    // }
    //
    // length = data.data.length;
    //
    // while ( (i += blockSize * 4) < length ) {
    //     ++count;
    //     rgb.r += data.data[i];
    //     rgb.g += data.data[i+1];
    //     rgb.b += data.data[i+2];
    // }
    //
    // // ~~ used to floor values
    // rgb.r = ~~(rgb.r/count);
    // rgb.g = ~~(rgb.g/count);
    // rgb.b = ~~(rgb.b/count);
    //
    // return {
    //     jpgData,
    //     averageColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    // };

// }

/**
 * Converts IMovieResultItem[] to ResultItemsObject
 * @see ResultItemsObject
 * @see IMovieResultItem
 * @return {ResultItemsObject} The transformed array to a map(object)
 * */
export function convertResultsData(results: IMovieResultItem[], page: number = 1): ResultItemsObject {
    let transformedData: ResultItemsObject = {};
    let startIndex = (page - 1) * 20;
    results.forEach((value, index) => transformedData[startIndex+index] = value);
    return transformedData;
}

export function cacheResultsPostersOnSession(results: IMovieResultItem[] | undefined): void {
    if (!results) return;

    results.forEach(({poster_path, id}) => {
        if (poster_path) {
            if (sessionStorage.getItem(String(id))) return;

            let img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                try {
                    let movieImgDataObj = (CanvasImgDataConverter.makeMovieImgSessionObj(img) as IMovieImgSessionObj);
                    saveMovieImgDataOnSession(movieImgDataObj, id);
                } catch (e) { console.error(e); }
            };
            img.src = `${posterSrcPathPrefix}${poster_path}`;
        }
    });
}

function saveMovieImgDataOnSession(movieImgSessionObj: IMovieImgSessionObj, movieId: number) {
    sessionStorage.setItem(String(movieId), JSON.stringify(movieImgSessionObj));
}

export function getMovieImgObjFromSession(movieId: number): IMovieImgSessionObj | undefined {
    let movieImgDataObj: IMovieImgSessionObj | undefined;
    let imgJsonData  = sessionStorage.getItem(String(movieId));

    if (imgJsonData)
        movieImgDataObj = (JSON.parse(imgJsonData) as IMovieImgSessionObj);

    return movieImgDataObj;
}

export function clearMultipleTimeouts(...timeouts: (NodeJS.Timeout | undefined)[]): void {
    for (let timeout of timeouts)
        if(timeout)
            clearTimeout(timeout);
}
