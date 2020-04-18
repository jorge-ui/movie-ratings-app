// Type definitions for movies.action
// Project: movie-ratings-app
// Definitions by: Jorge L. Rivera <jrdeveloper.me>
import IMoviesSearchData from "../../interfaces/app-types/IMoviesSearchData";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import { ListItemsActionTypes } from "./list-item.actions";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";

export type ActionItemName = "favorite" | "watchlist";

interface IListItemAction {
	name: ActionItemName
}

interface IFetchListItemsStart extends IListItemAction {
	type: typeof ListItemsActionTypes.FETCH_LIST_ITEMS_START;
}

interface IFetchListItemsSuccess extends IListItemAction {
	type: typeof ListItemsActionTypes.FETCH_LIST_ITEMS_SUCCESS;
	payload: { data: IMoviesSearchData, page: number };
}

interface IFetchListItemsFailure extends IListItemAction {
	type: typeof ListItemsActionTypes.FETCH_LIST_ITEMS_FAILURE;
	payload: IMoviesSearchError;
}

interface IUnshiftToListItemsMap extends IListItemAction {
	type: typeof ListItemsActionTypes.UNSHIFT_TO_LIST_ITEMS,
	payload: IMovieResultItem
}

interface IRemoveFromListItems extends IListItemAction {
	type: typeof ListItemsActionTypes.REMOVE_FROM_LIST_ITEMS,
	payload: number
}

export type IListItemsActions =
	| IFetchListItemsStart
	| IFetchListItemsSuccess
	| IFetchListItemsFailure
	| IUnshiftToListItemsMap
	| IRemoveFromListItems