import ImageDataEvent from "../utility/custom-events/ImageDataEvent";
import MovieViewEvent from "../utility/custom-events/MovieViewEvent";

declare global {
    const sessionColorsNowFetching: Set<number>;
    let sessionStorage: Storage;
    let localStorage: Storage;
    function addEventListener<K extends keyof CustomEventMap>(type: K, listener: (ev: CustomEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    function removeEventListener<K extends keyof CustomEventMap>(type: K, listener: (ev: CustomEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: (()=>void) | undefined,
        sessionColorsNowFetching: Set<number>,
        worker: Worker
    }
    interface Storage {
        setItem(key: MyLocalStorage, value: string): void;
        getItem(key: MyLocalStorage): string | null;
        removeItem(key: MyLocalStorage): void;
    }
    declare module "*.module.scss" {
        const content: {[className: string]: string};
        export = content;
    }
    declare module "*.scss" {
        const content: {[className: string]: string};
        export = content;
    }

}

type MyLocalStorage =
    | "session_id"
    | "token_data"

interface CustomEventMap {
    "imageData": ImageDataEvent,
    "movieView": MovieViewEvent
}

declare module "worker-loader!*" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class WebpackWorker extends Worker {
        constructor();
    }
}