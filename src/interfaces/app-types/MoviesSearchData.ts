// Movie search API on success fetch
import MovieSearchItem from "./MovieSearchItem";

export default interface MoviesSearchData {
    page: number;
    total_results: number;
    total_pages: number;
    results: ResultItemsObject;
}

/**
 * An object where each key corresponds to the index
 * of a MovieSearchItem[] array to get its value
 * */
export interface ResultItemsObject {
    [key: number]: MovieSearchItem | undefined
}