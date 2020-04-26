import IMovieImgSessionObj from "../../interfaces/app-types/IMovieImgSessionObj";

class ImageDataEvent extends CustomEvent<ImageDataEventDetail> {
    constructor(movieId: number, imgData: IMovieImgSessionObj) {
        super("imageData", {
            detail: {
                movieId,
                imgData
            }
        });
    }
}

interface ImageDataEventDetail {
    movieId: number;
    imgData: IMovieImgSessionObj;
}

export default ImageDataEvent;