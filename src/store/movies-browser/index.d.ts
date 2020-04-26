// Type definitions for movies-browser.action
// Project: movie-ratings-app
// Definitions by: Jorge L. Rivera <jrdeveloper.me>

import IMoviesSearchData, { ResultItemsObject } from "../../interfaces/app-types/IMoviesSearchData";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import { MoviesBrowserActionTypes } from "./movies-browser.actions";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";

export type MoviesBrowseNames =
    | "favorite"
    | "watchlist"
    | "search"
    | "nowPlaying"
    | "trendingWeek"

export type AccountItemsNames = Extract<MoviesBrowseNames, "favorite" | "watchlist">;

export interface ReducerNamesAction {
  name: MoviesBrowseNames
}
export interface IListItemAction {
  name: AccountItemsNames
}

interface IClearFetchedMovies extends ReducerNamesAction {
  type: typeof MoviesBrowserActionTypes.CLEAR_FETCHED_MOVIES
}

interface IFetchMoviesStart extends ReducerNamesAction {
  type: typeof MoviesBrowserActionTypes.FETCH_MOVIES_START;
}
interface IFetchMoviesSuccess extends ReducerNamesAction {
  type: typeof MoviesBrowserActionTypes.FETCH_MOVIES_SUCCESS;
  payload: { data: IMoviesSearchData; searchTerm?: string };
}
interface IFetchMoviesFailure extends ReducerNamesAction {
  type: typeof MoviesBrowserActionTypes.FETCH_MOVIES_FAILURE;
  payload: IMoviesSearchError;
}

interface IFetchMoreMoviesStart extends ReducerNamesAction {
  type: typeof MoviesBrowserActionTypes.FETCH_MORE_MOVIES_START;
}
interface IFetchMoreMoviesSuccess extends ReducerNamesAction {
  type: typeof MoviesBrowserActionTypes.FETCH_MORE_MOVIES_SUCCESS;
  payload: {
    results: ResultItemsObject,
    fetchedPage: number
  };
}
interface IFetchMoreMoviesFailure extends ReducerNamesAction {
  type: typeof MoviesBrowserActionTypes.FETCH_MORE_MOVIES_FAILURE;
  payload: IMoviesSearchError;
}

interface IUnshiftToListItemsMap extends IListItemAction {
  type: typeof MoviesBrowserActionTypes.UNSHIFT_TO_LIST_ITEMS,
  payload: IMovieResultItem
}

interface IRemoveFromListItems extends IListItemAction {
  type: typeof MoviesBrowserActionTypes.REMOVE_FROM_LIST_ITEMS,
  payload: number
}




export type ISearchActions =
  | IClearFetchedMovies
  | IFetchMoviesStart
  | IFetchMoviesSuccess
  | IFetchMoviesFailure
  | IFetchMoreMoviesStart
  | IFetchMoreMoviesSuccess
  | IFetchMoreMoviesFailure
  | IUnshiftToListItemsMap
  | IRemoveFromListItems
