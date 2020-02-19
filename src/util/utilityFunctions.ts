import MovieSearchItem from "../interfaces/app-types/MovieSearchItem";
import {ResultItemsObject} from "../interfaces/app-types/MoviesSearchData";

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

/**
 * Converts MovieSearchItem[] to ResultItemsObject
 * @see ResultItemsObject
 * @see MovieSearchItem
 * @return {ResultItemsObject} The transformed array to a map(object)
 * */
export function convertResultsData(results: MovieSearchItem[], page: number): ResultItemsObject {
    let transformedData: ResultItemsObject = {};
    let startIndex = (page - 1) * 20;
    results.forEach((value, index) => transformedData[startIndex+index] = value);
    return transformedData;
}
