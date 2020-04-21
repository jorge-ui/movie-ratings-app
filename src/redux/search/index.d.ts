// Type definitions for search.action
// Project: movie-ratings-app
// Definitions by: Jorge L. Rivera <jrdeveloper.me>

import IMoviesSearchData, { ResultItemsObject } from "../../interfaces/app-types/IMoviesSearchData";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import { AnyAction as ReduxAnyAction } from "redux";
import { SearchActionTypes } from "./search.actions";


interface IClearFetchedMovies extends ReduxAnyAction {
  type: typeof SearchActionTypes.CLEAR_FETCHED_MOVIES
}

interface IFetchMoviesStart extends ReduxAnyAction {
  type: typeof SearchActionTypes.FETCH_MOVIES_START;
}
interface IFetchMoviesSuccess extends ReduxAnyAction {
  type: typeof SearchActionTypes.FETCH_MOVIES_SUCCESS;
  payload: { data: IMoviesSearchData; searchTerm: string };
}
interface IFetchMoviesFailure extends ReduxAnyAction {
  type: typeof SearchActionTypes.FETCH_MOVIES_FAILURE;
  payload: IMoviesSearchError;
}


interface IFetchMoreMoviesStart extends ReduxAnyAction {
  type: typeof SearchActionTypes.FETCH_MORE_MOVIES_START;
}
interface IFetchMoreMoviesSuccess extends ReduxAnyAction {
  type: typeof SearchActionTypes.FETCH_MORE_MOVIES_SUCCESS;
  payload: {
    data: ResultItemsObject,
    fetchedPage: number
  };
}
interface IFetchMoreMoviesFailure extends ReduxAnyAction {
  type: typeof SearchActionTypes.FETCH_MORE_MOVIES_FAILURE;
  payload: IMoviesSearchError;
}


export type ISearchActions =
  | IClearFetchedMovies
  | IFetchMoviesStart
  | IFetchMoviesSuccess
  | IFetchMoviesFailure
  | IFetchMoreMoviesStart
  | IFetchMoreMoviesSuccess
  | IFetchMoreMoviesFailure
