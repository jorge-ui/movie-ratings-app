import {createSelector, Selector} from 'reselect';
import {AppState} from "../root-reducer";
import {MoviesState} from "./movies.reducer";

export const getMoviesState: Selector<AppState, MoviesState> = state => state.movies;

export const selectMoviesState = createSelector(
    [getMoviesState],
    movies => movies
);

export const selectMoviesResults = createSelector(
    [getMoviesState],
    ({searchResults}: MoviesState) => searchResults
);

export const selectMoviesResultsPaging = createSelector(
    [getMoviesState],
    ({searchResults}: MoviesState) => {

        if (searchResults !== null) {
            let {page, total_pages, total_results} = searchResults;
            return {page, total_pages, total_results};
        }
        else return null;
    }
);

export const selectMoviesCurrentSearchKeyword = createSelector(
    [getMoviesState],
    movies => movies.currentSearchKeyword
);