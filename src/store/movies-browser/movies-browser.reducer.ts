import IMoviesSearchData, { ResultItemsObject } from "../../interfaces/app-types/IMoviesSearchData";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import { MoviesBrowserActionTypes } from "./movies-browser.actions";
import { ISearchActions, MoviesBrowseNames } from "./";
import { Reducer } from "redux";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";

export interface MoviesBrowseState {
	searchData: IMoviesSearchData | null;
	searchError: IMoviesSearchError | null;
	isFetching: boolean;
	isFetchingMore: boolean;
	apiFetchedPages: number[];
	searchTerm: string;
}

const INITIAL_STATE: MoviesBrowseState = {
	searchData: null,
	searchError: null,
	isFetching: false,
	isFetchingMore: false,
	apiFetchedPages: [],
	searchTerm: ''
};

function makeMoviesBrowserReducer(name: MoviesBrowseNames): Reducer<MoviesBrowseState, ISearchActions> {
	return function(state = INITIAL_STATE, action) {

		if (action.name !== name) return state;

		switch (action.type) {
			case MoviesBrowserActionTypes.UNSHIFT_TO_LIST_ITEMS:
				return {
					...state,
					searchData: state.searchData && {
						...state.searchData,
						results: unshiftToObj({...state.searchData.results}, action.payload),
						total_pages: Math.ceil((state.searchData.total_results+1)/20),
						total_results: state.searchData.total_results+1
					}
				}

			case MoviesBrowserActionTypes.REMOVE_FROM_LIST_ITEMS:
				return {
					...state,
					searchData: state.searchData && {
						...state.searchData,
						results: removeFromObjById({...state.searchData.results}, action.payload),
						total_pages: Math.ceil((state.searchData.total_results-1)/20),
						total_results: state.searchData.total_results-1
					}
				}

			case MoviesBrowserActionTypes.CLEAR_FETCHED_MOVIES:
				return INITIAL_STATE;
			case MoviesBrowserActionTypes.FETCH_MOVIES_START:
				return {
					...INITIAL_STATE,
					isFetching: true,
				};
			case MoviesBrowserActionTypes.FETCH_MOVIES_SUCCESS:
				let {data: fetchedData} = action.payload;

				if (!fetchedData.total_results)
					return {
						...INITIAL_STATE,
						searchError: {
							errors: ["No results found."]
						}
					};

				return {
					...INITIAL_STATE,
					searchData: fetchedData,
					apiFetchedPages: [1],
					searchTerm: action.payload.searchTerm || ''
				};
			case MoviesBrowserActionTypes.FETCH_MOVIES_FAILURE:
				return {
					...INITIAL_STATE,
					searchError: action.payload
				};

			case MoviesBrowserActionTypes.FETCH_MORE_MOVIES_START:
				return {
					...state,
					isFetchingMore: true
				};
			case MoviesBrowserActionTypes.FETCH_MORE_MOVIES_SUCCESS:
				return {
					...state,
					searchData: {
						...state.searchData!,
						results: {
							...state.searchData!.results,
							...action.payload.results
						},
						page: action.payload.fetchedPage
					},
					apiFetchedPages: [
						...new Set([...state.apiFetchedPages, action.payload.fetchedPage])
					],
					isFetchingMore: false
				};
			case MoviesBrowserActionTypes.FETCH_MORE_MOVIES_FAILURE:
				return {
					...state,
					searchError: action.payload,
					isFetchingMore: false
				};
			default:
				return state;
		}
	};

}

function unshiftToObj(obj: ResultItemsObject, newItem: IMovieResultItem): ResultItemsObject {

	let temp = newItem;

	for (let key in obj) {
		let tempHold = obj[key]!;
		obj[key] = temp;
		temp = tempHold;
	}

	obj[Object.keys(obj).length] = temp;

	return obj;
}

function removeFromObjById(obj: ResultItemsObject, id: number): ResultItemsObject {
	let removed = false;
	for (let key in obj) {
		let numKey = Number(key)
		if (obj[numKey]?.id !== id && !removed) continue;

		if (removed) {
			obj[numKey - 1] = obj[numKey]!;
		} else {
			obj[numKey] = undefined;
			removed = true;
		}
	}
	if (removed)
		delete obj[Object.keys(obj).length-1];
	return obj;
}

export default makeMoviesBrowserReducer;
