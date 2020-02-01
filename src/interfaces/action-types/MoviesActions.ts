import MoviesSearchData from "../app-types/MoviesSearchData";
import MoviesSearchError from "../app-types/MoviesSearchError";
import {ReduxBaseAction} from "./ReduxBaseAction";

export enum MovieActionTypes {
    FETCH_MOVIES_START    = 'FETCH_MOVIES_START',
    FETCH_MOVIES_SUCCESS  = 'FETCH_MOVIES_SUCCESS',
    FETCH_MOVIES_FAILURE  = 'FETCH_MOVIES_FAILURE',
}

interface FetchMoviesStart extends ReduxBaseAction {
    type: typeof MovieActionTypes.FETCH_MOVIES_START,
}
interface FetchMoviesSuccess extends ReduxBaseAction {
    type: typeof MovieActionTypes.FETCH_MOVIES_SUCCESS,
    payload: MoviesSearchData
}
interface FetchMoviesFailure extends ReduxBaseAction {
    type: typeof MovieActionTypes.FETCH_MOVIES_FAILURE,
    payload: MoviesSearchError
}

export type MoviesActions = FetchMoviesStart | FetchMoviesSuccess | FetchMoviesFailure

