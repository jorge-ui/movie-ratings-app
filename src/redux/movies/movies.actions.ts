import IMoviesSearchData, {ResultItemsObject} from "../../interfaces/app-types/IMoviesSearchData";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import {IMoviesActions, MovieActionTypes} from "../../interfaces/action-types/IMoviesActions";
import {ThunkAction} from "redux-thunk";
import {AppState} from "../root-reducer";
import IMoviesSearchResponseData from "../../interfaces/app-types/IMoviesSearchResponseData";
import {IResultsPagingActions} from "../../interfaces/action-types/IResultsPagingActions";
import {cacheResultsPostersOnSession, convertResultsData} from "../../util/utilityFunctions";
import appProperties from "../../appProperties";

const {buildApiFetchUrl} = appProperties;


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
): ThunkAction<void, AppState, null, IMoviesActions | IResultsPagingActions> => async dispatch => {
    let {apiNowFetchingPages} = window;
    // Start
    dispatch(fetchMoviesStart());
    apiNowFetchingPages.add(1);
    try {
        let res = await fetch(buildApiFetchUrl(searchTerm));
        if (res.status !== 200) {
            let error: IMoviesSearchError = await res.json();
            dispatch(fetchMoviesFailure(error)); // Failure
        } else {
            let data: IMoviesSearchResponseData = await res.json();

            cacheResultsPostersOnSession(data.results);

            let transformedData: IMoviesSearchData = {
                ...data,
                results: convertResultsData(data.results)
            };

            setTimeout(() => dispatch(fetchMoviesSuccess(transformedData, searchTerm)), 100); // Success
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
        let res = await fetch(buildApiFetchUrl(searchTerm, nextPage));
        if (res.status !== 200) {
            let error: IMoviesSearchError = await res.json();
            dispatch(fetchMoreMoviesFailure(error)); // Failure
        } else {
            let data: IMoviesSearchResponseData = await res.json();

            cacheResultsPostersOnSession(data.results);

            let resultsObject = convertResultsData(data.results, nextPage);

            setTimeout(() => dispatch(fetchMoreMoviesSuccess(resultsObject, nextPage)), 100); // Success
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
