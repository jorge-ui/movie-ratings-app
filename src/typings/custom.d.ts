import ImageDataEvent from "../util/custom-events/ImageDataEvent";
import MovieViewEvent from "../util/custom-events/MovieViewEvent";

declare global {
    const apiNowFetchingPages: Set<number>;
    const sessionColorsNowFetching: Set<number>;
    function addEventListener<K extends keyof CustomEventMap>(type: K, listener: (ev: CustomEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    function removeEventListener<K extends keyof CustomEventMap>(type: K, listener: (ev: CustomEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: (()=>void) | undefined,
        apiNowFetchingPages: Set<number>,
        sessionColorsNowFetching: Set<number>,
        worker: Worker
    }
    interface Storage {
        setItem(key: MyLocalStorage, value: string): void;
        getItem(key: MyLocalStorage): string | null;
        removeItem(key: MyLocalStorage): void;
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
    class WebpackWorker extends Worker {
        constructor();
    }
}