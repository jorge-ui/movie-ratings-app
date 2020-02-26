import IMoviesSearchData, {ResultItemsObject} from "../app-types/IMoviesSearchData";
import IMoviesSearchError from "../app-types/IMoviesSearchError";
import {AnyAction as ReduxAnyAction} from "redux";

export enum MovieActionTypes {
  FETCH_MOVIES_START = "FETCH_MOVIES_START",
  FETCH_MOVIES_SUCCESS = "FETCH_MOVIES_SUCCESS",
  FETCH_MOVIES_FAILURE = "FETCH_MOVIES_FAILURE",
  FETCH_MORE_MOVIES_START = "FETCH_MORE_MOVIES_START",
  FETCH_MORE_MOVIES_SUCCESS = "FETCH_MORE_MOVIES_SUCCESS",
  FETCH_MORE_MOVIES_FAILURE = "FETCH_MORE_MOVIES_FAILURE",
}

interface FetchMoviesStart extends ReduxAnyAction {
  type: typeof MovieActionTypes.FETCH_MOVIES_START;
}
export interface FetchMoviesSuccess extends ReduxAnyAction {
  type: typeof MovieActionTypes.FETCH_MOVIES_SUCCESS;
  payload: { data: IMoviesSearchData; searchTerm: string };
}
export interface FetchMoviesFailure extends ReduxAnyAction {
  type: typeof MovieActionTypes.FETCH_MOVIES_FAILURE;
  payload: IMoviesSearchError;
}


interface FetchMoreMoviesStart extends ReduxAnyAction {
  type: typeof MovieActionTypes.FETCH_MORE_MOVIES_START;
}
export interface FetchMoreMoviesSuccess extends ReduxAnyAction {
  type: typeof MovieActionTypes.FETCH_MORE_MOVIES_SUCCESS;
  payload: {
    data: ResultItemsObject,
    fetchedPage: number
  };
}
export interface FetchMoreMoviesFailure extends ReduxAnyAction {
  type: typeof MovieActionTypes.FETCH_MORE_MOVIES_FAILURE;
  payload: IMoviesSearchError;
}


export type IMoviesActions =
  | FetchMoviesStart
  | FetchMoviesSuccess
  | FetchMoviesFailure
  | FetchMoreMoviesStart
  | FetchMoreMoviesSuccess
  | FetchMoreMoviesFailure
