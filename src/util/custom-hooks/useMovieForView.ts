import { Reducer, useCallback, useEffect, useReducer, useState } from "react";
import useSearchParam from "./useSearchParam";
import { useSelector } from "react-redux";
import { AppState } from "../../redux";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import IMovieView from "../../interfaces/app-types/IMovieView";
import { goFetchMovieView } from "../utilityFunctions";

const INITIAL_STATE: MovieForViewState = {movieViewItem: null, isLoading: false};

const movieViewReducer: Reducer<MovieForViewState, ReducerAction<keyof ActionsTypesToPayloadTypeMap>> =
	function movieViewReducer(state, action) {
		switch (action.type) {
			case "clear-item":
				return INITIAL_STATE;
			case "set-is-loading":
				return {
					...state,
					isLoading: true
				};
			case "set-movie-item":
				return {
					isLoading: false,
					movieViewItem: action.payload as ItemViewState
				};
		}
	};

// Reducer action creators
const onSetMovieItem = (item: ItemViewState): ReducerAction<"set-movie-item"> => ({
	type: "set-movie-item",
	payload: item
});

// @ts-ignore (because "payload" type = undefined)
const onSetIsLoading = (): ReducerAction<"set-is-loading"> => ({
	type: "set-is-loading",
});

function useMovieForView(): ReturnHookState {
	const [movieIdParam = 0, setMovieId] = useSearchParam("movieId");

	const [state, dispatch] = useReducer(movieViewReducer, INITIAL_STATE);
	const {movieViewItem, isLoading} = state;

	const clearMovieId = () => setMovieId(null);

	const selectMovieItem = useCallback((state: AppState) => {
		if (!movieIdParam) return null;
		const results = state.movies.searchData?.results;
		if (results) {
			for (let key in results)
				if (results[key]?.id === movieIdParam)
					return results[key] as IMovieResultItem;
		}
		// eslint-disable-next-line eqeqeq
		return state.movieItem.item?.id == movieIdParam ? state.movieItem.item : null;
	}, [movieIdParam]);

	const selectedMovie = useSelector<AppState, IMovieResultItem | null>(selectMovieItem, selectedAreEqual);

	const fromSelectedId = selectedMovie?.id ?? 0;

	useEffect(() => {
		if (isLoading) return;

		// selectedMovie matches movieIdParam and the item id on state is not same as selectedMovie id;
		if (fromSelectedId === movieIdParam && movieViewItem?.id !== movieIdParam)
			dispatch(onSetMovieItem(selectedMovie)); // set selectedMovie for view

		else if (( !movieViewItem || ( movieViewItem && (
						// current itemId on state !== id on searchParam
						// eslint-disable-next-line eqeqeq
						movieViewItem.id != movieIdParam
				))) && movieIdParam
		) {
			dispatch(onSetIsLoading());
			goFetchMovieView(selectedMovie ?? movieIdParam)
			.then(movieView => dispatch(onSetMovieItem(movieView)))
		}

		else if ( !movieIdParam && movieViewItem !== null) {
			// @ts-ignore (because "payload" type = undefined)
			dispatch({type: "clear-item"});
		}

	}, [movieIdParam, fromSelectedId, isLoading, movieViewItem]);

	const [movieForViewState, setMovieForViewState] =
		useState<ReturnHookState>({movieViewItem, isLoading, clearMovieId});

	useEffect(() => {
		setMovieForViewState({movieViewItem, isLoading, clearMovieId})
	}, [state]);

	return movieForViewState;
}

function selectedAreEqual(oldItem: IMovieResultItem | null, newItem: IMovieResultItem | null) {
	return oldItem?.id === newItem?.id
}

// Types
type ItemViewState = IMovieResultItem | IMovieView | null;
type ReturnHookState = MovieForViewState & {clearMovieId: () => void};

interface MovieForViewState {
	movieViewItem: ItemViewState;
	isLoading: boolean;
}

interface ActionsTypesToPayloadTypeMap {
	"set-is-loading": undefined;
	"set-movie-item": ItemViewState;
	"clear-item": undefined;
}

interface ReducerAction<Type extends keyof ActionsTypesToPayloadTypeMap> {
	type: Type;
	payload: ActionsTypesToPayloadTypeMap[Type]
}

export default useMovieForView;