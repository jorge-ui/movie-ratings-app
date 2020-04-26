import { getMovieImgObjFromSession } from "utility";
import { useLayoutEffect, useRef, useState } from "react";
import ImageDataEvent from "../utility/custom-events/ImageDataEvent";
import IMovieImgSessionObj from "../interfaces/app-types/IMovieImgSessionObj";


export function useSessionAvgColor(movieId: number) {
    const idRef = useRef(movieId);
    const [imgData, setImgData] = useState<IMovieImgSessionObj | undefined>();

    useLayoutEffect(() => {
        const imgObj = getMovieImgObjFromSession(idRef.current);
        function onColorReadyListener({detail: { movieId: movieIdSaved, imgData }}: ImageDataEvent) {
            if (movieIdSaved === idRef.current) {
                setImgData(imgData);
                window.removeEventListener("imageData", onColorReadyListener);
            }
        }
        if (!imgObj) window.addEventListener("imageData", onColorReadyListener);
        else setImgData(imgObj);
        return () => window.removeEventListener("imageData", onColorReadyListener);
    }, []);


    return imgData;
}

