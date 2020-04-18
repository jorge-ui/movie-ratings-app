import IMoviesSearchData from "../../interfaces/app-types/IMoviesSearchData";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import IMoviesResponseData from "../../interfaces/app-types/IMoviesResponseData";
import { convertResultsData, goFetchPostersOnWorker } from "../../util/utilityFunctions";
import { ActionItemName, IListItemsActions } from "./index";
import appProperties from "../../appProperties";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";

const {getItemsListUrl} = appProperties;

export enum ListItemsActionTypes {
	FETCH_LIST_ITEMS_START = "FETCH_LIST_ITEMS_START",
	FETCH_LIST_ITEMS_SUCCESS = "FETCH_LIST_ITEMS_SUCCESS",
	FETCH_LIST_ITEMS_FAILURE = "FETCH_LIST_ITEMS_FAILURE",
	UNSHIFT_TO_LIST_ITEMS = "UNSHIFT_TO_LIST_ITEMS",
	REMOVE_FROM_LIST_ITEMS = "REMOVE_FROM_LIST_ITEMS"
}

export const unshiftToListItems = (item: IMovieResultItem, name: ActionItemName): IListItemsActions => ({
	type: ListItemsActionTypes.UNSHIFT_TO_LIST_ITEMS,
	payload: item,
	name
});

export const removeFromListItems = (id: number, name: ActionItemName): IListItemsActions => ({
	type: ListItemsActionTypes.REMOVE_FROM_LIST_ITEMS,
	payload: id,
	name
});

export const fetchListItemsStart = (name: ActionItemName): IListItemsActions => ({
	type: ListItemsActionTypes.FETCH_LIST_ITEMS_START,
	name
});


export const fetchListItemsSuccess = (
	data: IMoviesSearchData, page: number, name: ActionItemName
): IListItemsActions => ({
	type: ListItemsActionTypes.FETCH_LIST_ITEMS_SUCCESS,
	payload: {data, page},
	name
});


export const fetchListItemsFailure = (
	error: IMoviesSearchError, name: ActionItemName
): IListItemsActions => ({
	type: ListItemsActionTypes.FETCH_LIST_ITEMS_FAILURE,
	payload: error,
	name
});


export const fetchListItemsAsync = (page: number, name: ActionItemName):
	ThunkAction<void, AppState, null, IListItemsActions> => async (dispatch) => {
	// Start

	dispatch(fetchListItemsStart(name));
	try {
		let res = await fetch(getItemsListUrl(page, name));
		if (!res.ok) {
			let error: IMoviesSearchError = await res.json();
			dispatch(fetchListItemsFailure(error, name)); // Failure
		} else {
			let data: IMoviesResponseData = await res.json();

			goFetchPostersOnWorker(data.results);

			let transformedData: IMoviesSearchData = {
				...data,
				results: convertResultsData(data.results, page)
			};

			setTimeout(() => dispatch(fetchListItemsSuccess(transformedData, page, name)), 50); // Success
		}
	} catch (error) {
		dispatch(
			fetchListItemsFailure({
				errors: ["Internal server error."] // Failure
			}, name)
		);
	}
};