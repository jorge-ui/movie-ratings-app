import IMovieResultItem from "../interfaces/app-types/IMovieResultItem";
import { ResultItemsObject } from "../interfaces/app-types/IMoviesSearchData";
import IMovieImgSessionObj from "../interfaces/app-types/IMovieImgSessionObj";
import appProperties from "../appProperties";
import CanvasImgDataConverter from "./CanvasImgDataConverter";
import WorkerFetchedDoneEvent from "../interfaces/custom-events-types/WorkerFetchedDoneEvent";
import ImageDataEvent from "./custom-events/ImageDataEvent";
import SearchParamsMap from "../interfaces/app-types/SearchParamsMap";
import CustomURLSearchParams from "./custom-objects/CustomURLSearchParams";
import IMovieView from "../interfaces/app-types/IMovieView";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { UserState } from "../redux/user";
import TokenData from '../interfaces/app-types/TokenData';

const { buildFetchMovieViewUrl, newSessionUrl, buildAccountUrl } = appProperties;

export function wait(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export function checkIsMobile(): boolean {
    return window.innerWidth <= 600;
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

export function onWorkerFetchedDoneEvent({data: {blobUrl, id}} : WorkerFetchedDoneEvent) {
    if(sessionStorage.getItem(String(id))) {
        URL.revokeObjectURL(blobUrl);
        return;
    }

    let img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        try {
            let movieImgDataObj = (CanvasImgDataConverter.makeMovieImgSessionObj(img) as IMovieImgSessionObj);
            saveMovieImgDataOnSession(movieImgDataObj, id);
            dispatchEvent(new ImageDataEvent(id, movieImgDataObj));
        }
        catch (e) {
            console.error(e);
        }
        finally {
            window.sessionColorsNowFetching.delete(id);
            URL.revokeObjectURL(blobUrl);
        }
    };
    img.src = blobUrl;
}

export function goFetchPostersOnWorker(item_s_: IMovieResultItem[] | IMovieResultItem | undefined): void {
    if (!item_s_) return;

    const isArray = Array.isArray(item_s_);
    let toFetch;

    if (isArray) {
        toFetch = (item_s_ as IMovieResultItem[]).filter(({id, poster_path}) =>
                poster_path && !sessionStorage.getItem(String(id))
            );
    } else toFetch = item_s_;

    if (!(isArray && (toFetch as []).length === 0))
        window.worker.postMessage(toFetch);
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

export function clearTimeouts(...timeouts: (NodeJS.Timeout | undefined)[]): void {
    for (let timeout of timeouts)
        if(timeout)
            clearTimeout(timeout);
}

const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
export function getReadableDate(isoDate: string) {
    let date = isoDate.split('-').map(n => Number(n));
    let month = months[date[1]-1];
    let day = date[2];
    let year = date[0];

    return `${month} ${day}, ${year}`
}

export const formatToUSD = new Intl.NumberFormat('en-US', {
    currency: "USD"
}).format;

export function minutesToRuntimeDisplay(minutes: number) {
    let hours = Math.floor(minutes/60);
    let remaining = minutes%60;
    return `${hours}h ${remaining}m`
}

export function setScrollLocked(lock: boolean = true) {
    if (checkIsMobile()) return;
    // if(lock) {
    //     const supportPageOffset = window.pageXOffset !== undefined;
    //     const isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
    //     const y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
    //     document.onscroll = () => window.scrollY && window.scrollTo(0, y);
    // }
    // else (document.onscroll = null)
    if (lock)
        disableBodyScroll(document.scrollingElement as Element, {
            allowTouchMove: el => el.id === "movie-item-view"
        });
    else enableBodyScroll(document.scrollingElement as Element);
}

export function getSearchParam<Param extends keyof SearchParamsMap>(paramName: Param): SearchParamsMap[Param] | null {
    let query = window.location.hash.split("?")[1];
    return new CustomURLSearchParams(query).get(paramName);
}
export function setSearchParam<Param extends keyof SearchParamsMap>
    (paramName: Param, value: SearchParamsMap[Param] | null): void {
        let [hash, hashQuery] = window.location.hash.split("?");
        let newParams = new CustomURLSearchParams(hashQuery);

        value === null ?
            newParams.delete(paramName) : newParams.set(paramName, value);

        window.location.hash = hash.substr(1) + "?" + newParams.toString();
}

export function isMovieView(movie: IMovieResultItem | IMovieView | null): movie is IMovieView {
    if (!movie) return false;
    return 'budget' in movie;
}

export function goFetchMovieView(movieId_or_Item: number | IMovieResultItem): Promise<IMovieView> {
    let id: number;

    if (typeof movieId_or_Item === "number") {
        id = movieId_or_Item;
    } else {
        id = movieId_or_Item.id;
        goFetchPostersOnWorker(movieId_or_Item)
    }

    return new Promise<IMovieView>((resolve) => {
        fetch(buildFetchMovieViewUrl(id))
            .then(res => res.json())
            .then(resolve)
            .catch(console.error);
        })
}

export function goFetch<T = any>(url: string, options?: RequestInit) {
    return new Promise<T>((resolve) => {
        fetch(url, options)
            .then(res => res.json())
            .then(resolve)
            .catch(console.log);
    })
}

export function scrollToTop() {
    document.scrollingElement?.scrollTo(0, 0);
}

export async function goFetchUserAccount(): Promise<UserState> {
        let fetchUrl: string;

        const session_id = localStorage.getItem("session_id");

        if (!session_id) {
            const searchParams = new URLSearchParams(window.location.search);
            const requestToken = searchParams.get('request_token');
            const approved = searchParams.get('approved');

            if (requestToken && approved && approved === 'true') {
                try {
                    let fetchedSessionId = await goFetchSessionId(requestToken);
                    fetchUrl = buildAccountUrl(fetchedSessionId);
                    alert("Successfully logged in!");
                    localStorage.setItem("session_id", fetchedSessionId);
                }
                catch (e) {
                    throw e;
                }
            }
            // eslint-disable-next-line no-throw-literal
            else throw "No user logged in";

        } else {
            fetchUrl = buildAccountUrl(session_id);
        }

        const res = await fetch(fetchUrl);

        return await res.json();
}

async function goFetchSessionId(request_token: string): Promise<string> {

    const init: RequestInit = {
        method: 'POST',
        body: JSON.stringify({request_token}),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const res = await fetch(newSessionUrl, init)

    const data = await res.json();

    return data.session_id as string;
}

export function goFetchRequestToken() {

}

/**
 *  @return the current path on a HashBrowser-based url
 *  @param url Can be either a full URL of a hash portion
 * */
export const getHashPath = (url: string = window.location.hash): string =>
    (url[0] === '#' ? url.substr(1) :
        (url.includes('#') ? (url.split('#')[1] || '') : url)
    ).split('?')[0] || '/';

/**
 *  @return a string of query parameters on a HashBrowser-based url
 *  @param url Can be either a full URL of a hash portion
 * */
export const getHashQuery = (url: string = window.location.hash): string =>
    (url[0] === '#' ? url.substr(1) :
            (url.includes('#') ? (url.split('#')[1] || '') : url)
    ).split('?')[1] || '';

export function isValidRequestToken(tokenResponse: TokenData): boolean {
    const expireTime = new Date(tokenResponse.expires_at).getTime();
    // at least five(5) minutes remaining until expiration
    return expireTime - Date.now() > 300_000;
}