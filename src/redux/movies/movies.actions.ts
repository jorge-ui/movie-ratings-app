import MoviesSearchData, {ResultItemsObject} from "../../interfaces/app-types/MoviesSearchData";
import MoviesSearchError from "../../interfaces/app-types/MoviesSearchError";
import {IMoviesActions, MovieActionTypes} from "../../interfaces/action-types/IMoviesActions";
import {ThunkAction} from "redux-thunk";
import {AppState} from "../root-reducer";
import MoviesSearchResponseData from "../../interfaces/app-types/MoviesSearchResponseData";
import {IResultsPagingActions} from "../../interfaces/action-types/IResultsPagingActions";
import {convertResultsData} from "../../util/utilityFunctions";

const {REACT_APP_API_KEY} = process.env;


export const fetchMoviesStart = (): IMoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_START,
});


export const fetchMoviesSuccess = (
    data: MoviesSearchData,
    searchTerm: string
): IMoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_SUCCESS,
    payload: {data, searchTerm}
});


export const fetchMoviesFailure = (
    error: MoviesSearchError
): IMoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_FAILURE,
    payload: error
});


export const fetchMoviesAsync = (
    searchTerm: string
): ThunkAction<void, AppState, null, IMoviesActions | IResultsPagingActions> => async dispatch => {
    let {apiNowFetchingPages} = window;
    // Start
    dispatch(fetchMoviesStart());
    apiNowFetchingPages.add(1);
    try {
        let res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${REACT_APP_API_KEY}&query=${searchTerm}`
        );
        if (res.status !== 200) {
            let error: MoviesSearchError = await res.json();
            dispatch(fetchMoviesFailure(error)); // Failure
        } else {
            let data: MoviesSearchResponseData = await res.json();

            data.results.forEach(({poster_path}) => {
                if (poster_path)
                    fetch(`https://image.tmdb.org/t/p/w300${poster_path}`);
            });

            let transformedData: MoviesSearchData = {
                ...data,
                results: convertResultsData(data.results, 1)
            };
            dispatch(fetchMoviesSuccess(transformedData, searchTerm)); // Success
        }
    } catch (error) {
        dispatch(
            fetchMoviesFailure({
                errors: ["Internal server error."] // Failure
            })
        );
    } finally {
        apiNowFetchingPages.delete(1);
    }
};


export const fetchMoreMoviesStart = (): IMoviesActions => ({
    type: MovieActionTypes.FETCH_MORE_MOVIES_START
});


export const fetchMoreMoviesSuccess = (
    data: ResultItemsObject,
    fetchedPage: number
): IMoviesActions => ({
    type: MovieActionTypes.FETCH_MORE_MOVIES_SUCCESS,
    payload: {data, fetchedPage}
});


export const fetchMoreMoviesFailure = (
    error: MoviesSearchError
): IMoviesActions => ({
    type: MovieActionTypes.FETCH_MORE_MOVIES_FAILURE,
    payload: error
});


export const fetchMoreMoviesAsync = (
    nextPage: number
): ThunkAction<void, AppState, null, IMoviesActions> => async (
    dispatch,
    getState
) => {
    let {apiNowFetchingPages} = window;
    let searchTerm = getState().movies.currentSearchTerm;
    // Start
    dispatch(fetchMoreMoviesStart());
    apiNowFetchingPages.add(nextPage);
    try {
        let res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${REACT_APP_API_KEY}&query=${searchTerm}&page=${nextPage}`
        );
        if (res.status !== 200) {
            let error: MoviesSearchError = await res.json();
            dispatch(fetchMoreMoviesFailure(error)); // Failure
        } else {
            let data: MoviesSearchResponseData = await res.json();

            data.results.forEach(({poster_path}) => {
                if (poster_path)
                    fetch(`https://image.tmdb.org/t/p/w300${poster_path}`);
            });

            let resultsObject = convertResultsData(data.results, nextPage);

            dispatch(fetchMoreMoviesSuccess(resultsObject, nextPage)); // Success
        }
    } catch (error) {
        dispatch(
            fetchMoreMoviesFailure({
                errors: ["Internal server error."] // Failure
            })
        );
    } finally {
        apiNowFetchingPages.delete(nextPage);
    }
};
