import MoviesSearchData, {ResultItemsObject} from "../app-types/MoviesSearchData";
import MoviesSearchError from "../app-types/MoviesSearchError";
import IReduxBaseAction from "./IReduxBaseAction";

export enum MovieActionTypes {
  FETCH_MOVIES_START = "FETCH_MOVIES_START",
  FETCH_MOVIES_SUCCESS = "FETCH_MOVIES_SUCCESS",
  FETCH_MOVIES_FAILURE = "FETCH_MOVIES_FAILURE",
  FETCH_MORE_MOVIES_START = "FETCH_MORE_MOVIES_START",
  FETCH_MORE_MOVIES_SUCCESS = "FETCH_MORE_MOVIES_SUCCESS",
  FETCH_MORE_MOVIES_FAILURE = "FETCH_MORE_MOVIES_FAILURE",
}

interface FetchMoviesStart extends IReduxBaseAction {
  type: typeof MovieActionTypes.FETCH_MOVIES_START;
}
export interface FetchMoviesSuccess extends IReduxBaseAction {
  type: typeof MovieActionTypes.FETCH_MOVIES_SUCCESS;
  payload: { data: MoviesSearchData; searchTerm: string };
}
export interface FetchMoviesFailure extends IReduxBaseAction {
  type: typeof MovieActionTypes.FETCH_MOVIES_FAILURE;
  payload: MoviesSearchError;
}


interface FetchMoreMoviesStart extends IReduxBaseAction {
  type: typeof MovieActionTypes.FETCH_MORE_MOVIES_START;
}
export interface FetchMoreMoviesSuccess extends IReduxBaseAction {
  type: typeof MovieActionTypes.FETCH_MORE_MOVIES_SUCCESS;
  payload: {
    data: ResultItemsObject,
    fetchedPage: number
  };
}
export interface FetchMoreMoviesFailure extends IReduxBaseAction {
  type: typeof MovieActionTypes.FETCH_MORE_MOVIES_FAILURE;
  payload: MoviesSearchError;
}




export type IMoviesActions =
  | FetchMoviesStart
  | FetchMoviesSuccess
  | FetchMoviesFailure
  | FetchMoreMoviesStart
  | FetchMoreMoviesSuccess
  | FetchMoreMoviesFailure
