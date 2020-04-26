// Movie movies-browser API on success fetch
import IMovieResultItem from "./IMovieResultItem";

export default interface IMoviesSearchData {
    page: number;
    total_results: number;
    total_pages: number;
    results: ResultItemsObject;
}

/**
 * An object where each key corresponds to the index
 * of a IMovieResultItem[] array to get its value
 * */
export interface ResultItemsObject {
    [key: number]: IMovieResultItem | undefined
}