// Movie search API on success fetch
import MovieSearchItem from "./MovieSearchItem";

export default interface MoviesSearchData {
    page: number;
    total_results: number;
    total_pages: number;
    results: MovieSearchItem[];
}