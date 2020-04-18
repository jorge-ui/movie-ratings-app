// Movie search API on success fetch
import IMovieResultItem from "./IMovieResultItem";

export default interface IMoviesResponseData {
    page: number;
    total_results: number;
    total_pages: number;
    results: IMovieResultItem[];
}