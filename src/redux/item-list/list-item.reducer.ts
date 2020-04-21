import { ActionItemName, IListItemsActions } from "./index";
import { ListItemsActionTypes } from "./list-item.actions";
import { ResultItemsObject } from "../../interfaces/app-types/IMoviesSearchData";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";

export interface ListItemsState {
	page: number;
	results: ResultItemsObject | null;
	total_pages: number;
	total_results: number;
	apiFetchedPages: number[];
	isLoading: boolean;
	error: IMoviesSearchError | null;
}

const INITIAL_STATE: ListItemsState = {
	page: 0,
	results: null,
	total_pages: 0,
	total_results: 0,
	apiFetchedPages: [],
	isLoading: false,
	error: null
};
function createListItemReducer(itemName: ActionItemName) {
	return function listItemReducer(state = INITIAL_STATE, action: IListItemsActions ): ListItemsState {
		const { name } = action;
		if (name !== itemName) return state;
		switch (action.type) {
			case ListItemsActionTypes.UNSHIFT_TO_LIST_ITEMS:
				return {
					...state,
					results: state.results && unshiftToObj(state.results, action.payload),
					total_pages: Math.ceil((state.total_results+1)/20),
					total_results: state.total_results+1
				}
			case ListItemsActionTypes.REMOVE_FROM_LIST_ITEMS:
				return {
					...state,
					results: state.results && removeFromObjById(state.results, action.payload),
					total_pages: Math.ceil((state.total_results-1)/20),
					total_results: state.total_results-1
				}
			case ListItemsActionTypes.FETCH_LIST_ITEMS_START:
				return {
					...state,
					isLoading: true,
				}
			case ListItemsActionTypes.FETCH_LIST_ITEMS_SUCCESS:
				return {
					...state,
					...action.payload.data,
					results: {
						...state.results,
						...action.payload.data.results
					},
					apiFetchedPages: [
						...new Set([...state.apiFetchedPages, action.payload.page])
					],
					isLoading: false,
				}
			case ListItemsActionTypes.FETCH_LIST_ITEMS_FAILURE:
				return {
					...state,
					error: action.payload,
					isLoading: false,
				}
			default:
				return state;
		}
	};
}

function unshiftToObj(obj: ResultItemsObject, newItem: IMovieResultItem): ResultItemsObject {
	let tempOut = newItem;
	for (let key in obj) {
		let tempHold = obj[key]!;
		obj[key] = tempOut;
		tempOut = tempHold;
	}
	obj[Object.keys(obj).length] = tempOut;
	return obj;
}

function removeFromObjById(obj: ResultItemsObject, id: number): ResultItemsObject {
	let removed = false;
	for (let key in obj) {
		let numKey = Number(key)
		if (obj[numKey]?.id !== id && !removed) continue;
		if (removed)
			obj[numKey-1] = obj[numKey];
		else {
			obj[numKey] = undefined;
			removed = true;
		}
	}
	if (removed)
		delete obj[Object.keys(obj).length-1];
	return {...obj};
}

export default createListItemReducer;