import { MoviesBrowseNames } from "store/movies-browser";
import useSearchParam from "./useSearchParam";
import IMovieResultItem from "../interfaces/app-types/IMovieResultItem";
import { useEffect, useRef, useState } from "react";
import getMoviesBrowserActions from "store/movies-browser/movies-browser.actions";
import { useSelector } from "react-redux";
import store, { AppState } from "store";
import { MoviesBrowseState } from "store/movies-browser/movies-browser.reducer";
import { calculatePageOnApi } from "utility";
import appProperties from "../appProperties";
import IMoviesSearchError from "../interfaces/app-types/IMoviesSearchError";

const {itemsPerPageUI} = appProperties;

type MoviesBrowseActions = ReturnType<typeof getMoviesBrowserActions>;
export type PortionItemUI = IMovieResultItem | Pick<IMovieResultItem, "id">;
export type ItemsPortionUI = PortionItemUI[];

export function isMovieItem(item: PortionItemUI): item is IMovieResultItem {
	return 'title' in item;
}

interface useMovieItemsHook {
	items: ItemsPortionUI,
	error: IMoviesSearchError | null
	pageUI: number,
	isLoading: boolean,
	goToPage: (page: number) => void,
	totalPagesUI: number,
	totalResults: number,
}
interface useMovieItemsProps<TNames> {
	name: TNames;
	searchQuery?: string;
}

type PropTypes =
	| {name: "favorite" }
	| {name: "watchlist" }
	| {name: "search", searchQuery: string }
	| {name: "nowPlaying" }
	| {name: "trendingWeek" }


const isFetchingOrLengthEquality = (newState: MoviesBrowseState, oldState: MoviesBrowseState) =>
	(newState.isFetching === oldState.isFetching && newState.isFetchingMore === oldState.isFetchingMore)
	&& (Object.keys(newState.searchData?.results || {}).length === Object.keys(oldState.searchData?.results || {}).length)

/**
 *  @description <p>The 'goToPage' property of the returned object is not available for "trendingWeek"</p>.
 *                <p>Also, authentication is required to retrieve: </p>
 *                <ul>
 *                    <li>favorite</li>
 *                    <li>watchlist</li>
 *                </ul>
 * */
function useMovieItems<TNames extends MoviesBrowseNames>
	(props: useMovieItemsProps<TNames> & PropTypes) {

	// get corresponding actions
	const [actionsInit] = useState(() => getMoviesBrowserActions(props.name));
	const actionsRef = useRef<MoviesBrowseActions>(actionsInit);
	const nameRef = useRef<MoviesBrowseNames>(props.name);

	// get corresponding state
	const state = useSelector<AppState, MoviesBrowseState>
		(state => state[props.name], isFetchingOrLengthEquality);


	const [pageUI = 1, setPage] = useSearchParam("page", pageUI => {
		pageUI && store.dispatch(actionsRef.current.checkIfFetchMore(pageUI));
	});

	useEffect(() => {
		if (nameRef.current === "search") return;
		if (!store.getState()[nameRef.current].searchData)
			store.dispatch(actionsRef.current.fetchMoviesAsync())
	}, []);


	useEffect(() => {
		const id = setTimeout(() => { // this timeOut is to make sure the effect has the latest dependencies because it there could be a delay between pageUI param and searchQuery arg
			if (nameRef.current === "search" && state.searchTerm !== props.searchQuery && props.searchQuery && !state.isFetching)
				store.dispatch(actionsRef.current.fetchMoviesAsync(props.searchQuery, calculatePageOnApi(pageUI)));
		}, 150)
		return () => clearTimeout(id);
	}, [pageUI, props.searchQuery, state]);


	return ({
		        items  :  selectItemsUIPortion(state, pageUI), // select a portion based on "itemsPerPageUI" defined in "/appProperties"
		        error  :  state.searchError,
		       pageUI  :  pageUI,
		    isLoading  :  state.isFetching,
		 totalPagesUI  :  calculateTotalPagesUI(state.searchData?.total_results || 0),
		 totalResults  :  state.searchData?.total_results || 0,
		     goToPage  :  (nameRef.current !== "trendingWeek") ? ((page: number) => setPage(page)) : undefined
	} as
		TNames extends "trendingWeek" ? Omit<useMovieItemsHook, "goToPage"> : useMovieItemsHook)

}

function selectItemsUIPortion(browseState: MoviesBrowseState, pageUI: number = 1) {
	let selected: ItemsPortionUI = [];

	if (browseState.isFetching || !browseState.searchData) return selected;

	const fromIndex = ((pageUI - 1) * itemsPerPageUI);

	for (let i = 0; i < itemsPerPageUI; i++) {
		let grabIndex = fromIndex + i;
		let item = browseState.searchData.results[grabIndex];
		selected[i] = item || {id: grabIndex}; // provisional key
		if (grabIndex+1 === browseState.searchData.total_results) break; // break if last item
	}

	return selected;
}

function calculateTotalPagesUI(totalResultsApi: number) {
	return Math.ceil( totalResultsApi / itemsPerPageUI );
}

export default useMovieItems;