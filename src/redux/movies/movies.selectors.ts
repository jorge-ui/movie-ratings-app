import {createSelector, Selector} from 'reselect';
import {AppState} from "../root-reducer";
import {MoviesState} from "./movies.reducer";

export const getMovies: Selector<AppState, MoviesState> = state => state.movies;

export const selectMovies = createSelector(
    [getMovies],
    movies => movies
);