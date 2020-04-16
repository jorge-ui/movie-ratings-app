import IMoviesSearchData, { ResultItemsObject } from "../../interfaces/app-types/IMoviesSearchData";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import { IMoviesActions } from "./";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../";
import IMoviesSearchResponseData from "../../interfaces/app-types/IMoviesSearchResponseData";
import { convertResultsData, getSearchParam, goFetchPostersOnWorker } from "../../util/utilityFunctions";
import appProperties from "../../appProperties";

const {buildFetchMovieSearchUrl, perPageResultsItems} = appProperties;

export enum MovieActionTypes {
    FETCH_MOVIES_START = "FETCH_MOVIES_START",
    FETCH_MOVIES_SUCCESS = "FETCH_MOVIES_SUCCESS",
    FETCH_MOVIES_FAILURE = "FETCH_MOVIES_FAILURE",
    FETCH_MORE_MOVIES_START = "FETCH_MORE_MOVIES_START",
    FETCH_MORE_MOVIES_SUCCESS = "FETCH_MORE_MOVIES_SUCCESS",
    FETCH_MORE_MOVIES_FAILURE = "FETCH_MORE_MOVIES_FAILURE",
    CLEAR_FETCHED_MOVIES = "CLEAR_FETCHED_MOVIES",
}

export const clearFetchedMovies = (): IMoviesActions => ({
    type: MovieActionTypes.CLEAR_FETCHED_MOVIES
})

export const fetchMoviesStart = (): IMoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_START,
});


export const fetchMoviesSuccess = (
    data: IMoviesSearchData,
    searchTerm: string
): IMoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_SUCCESS,
    payload: {data, searchTerm}
});


export const fetchMoviesFailure = (
    error: IMoviesSearchError
): IMoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_FAILURE,
    payload: error
});


export const fetchMoviesAsync = (
    searchTerm: string
): ThunkAction<void, AppState, null, IMoviesActions> => async dispatch => {
    // Start
    dispatch(fetchMoviesStart());
    apiNowFetchingPages.add(1);
    try {
        let res = await fetch(buildFetchMovieSearchUrl(searchTerm));
        if (res.status !== 200) {
            let error: IMoviesSearchError = await res.json();
            dispatch(fetchMoviesFailure(error)); // Failure
        } else {
            let data: IMoviesSearchResponseData = await res.json();

            goFetchPostersOnWorker(data.results);

            let transformedData: IMoviesSearchData = {
                ...data,
                results: convertResultsData(data.results)
            };

            setTimeout(() => dispatch(fetchMoviesSuccess(transformedData, searchTerm)), 50); // Success
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
    error: IMoviesSearchError
): IMoviesActions => ({
    type: MovieActionTypes.FETCH_MORE_MOVIES_FAILURE,
    payload: error
});


export const fetchMoreMoviesAsync = (
    nextPageOnApi: number, ...otherPagesOnApi: number[]
): ThunkAction<void, AppState, null, IMoviesActions> => async (
    dispatch,
    getState
) => {
    let searchTerm = getSearchParam("s");
    if (!searchTerm) return;
    // Start
    dispatch(fetchMoreMoviesStart());
    apiNowFetchingPages.add(nextPageOnApi);
    try {
        let res = await fetch(buildFetchMovieSearchUrl(searchTerm, nextPageOnApi));
        if (res.status !== 200) {
            let error: IMoviesSearchError = await res.json();
            dispatch(fetchMoreMoviesFailure(error)); // Failure
        } else {
            let data: IMoviesSearchResponseData = await res.json();

            goFetchPostersOnWorker(data.results);

            let resultsObject = convertResultsData(data.results, nextPageOnApi);

            setTimeout(() => dispatch(fetchMoreMoviesSuccess(resultsObject, nextPageOnApi)), 50); // Success
        }
    } catch (error) {
        dispatch(
            fetchMoreMoviesFailure({
                errors: ["Internal server error."] // Failure
            })
        );
    } finally {
        apiNowFetchingPages.delete(nextPageOnApi);
        if (otherPagesOnApi.length) {
            // @ts-ignore
            dispatch(fetchMoreMoviesAsync(...otherPagesOnApi))
        }
    }
};

export const checkIfFetchMore = (
    pageOnUi: number
): ThunkAction<void, AppState, null, IMoviesActions> => async (dispatch, getState) => {
    if (!pageOnUi) return;

    const { apiFetchedPages, searchData } = getState().movies;
    const total_pages = searchData?.total_pages || 0;

    const isFetchPage = (pageOnApi: number) => // this is a utility function
        pageOnApi>0 && pageOnApi<=total_pages && !apiFetchedPages.includes(pageOnApi)
        && !apiNowFetchingPages.has(pageOnApi);

    let totalViewedOnPortion = pageOnUi * perPageResultsItems;

    let nextPageViewOnApi = Math.ceil((totalViewedOnPortion + perPageResultsItems) / 20);

    if (isFetchPage(nextPageViewOnApi))
        dispatch(fetchMoreMoviesAsync(nextPageViewOnApi))
    if (isFetchPage(nextPageViewOnApi - 1))
        dispatch(fetchMoreMoviesAsync(nextPageViewOnApi - 1))
    if (isFetchPage(nextPageViewOnApi - 2))
        dispatch(fetchMoreMoviesAsync(nextPageViewOnApi - 2))
}
