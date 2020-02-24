import IMoviesSearchData from "../../interfaces/app-types/IMoviesSearchData";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import {FetchMoviesSuccess, IMoviesActions, MovieActionTypes} from "../../interfaces/action-types/IMoviesActions";

export interface MoviesState {
    currentSearchTerm: string;
    searchData: IMoviesSearchData | null;
    searchError: IMoviesSearchError | null;
    isFetching: boolean;
    isFetchingMore: boolean;
    apiFetchedPages: number[];
}

const INITIAL_STATE: MoviesState = {
    currentSearchTerm: "",
    searchData: null,
    searchError: null,
    isFetching: false,
    isFetchingMore: false,
    apiFetchedPages: [],
};

const moviesReducer = (
    state = INITIAL_STATE,
    action: IMoviesActions
): MoviesState => {
    switch (action.type) {
        case MovieActionTypes.FETCH_MOVIES_START:
            return {
                ...INITIAL_STATE,
                isFetching: true,
            };
        case MovieActionTypes.FETCH_MOVIES_SUCCESS:
            let {data: fetchedData, searchTerm} = (action as FetchMoviesSuccess).payload;

            if (!fetchedData.total_results)
                return {
                    ...INITIAL_STATE,
                    currentSearchTerm: searchTerm,
                    searchError: {
                        errors: ["No results found."]
                    }
                };

            return {
                ...INITIAL_STATE,
                searchData: fetchedData,
                currentSearchTerm: searchTerm,
                apiFetchedPages: [1]
            };
        case MovieActionTypes.FETCH_MOVIES_FAILURE:
            return {
                ...INITIAL_STATE,
                searchError: action.payload
            };

        case MovieActionTypes.FETCH_MORE_MOVIES_START:
            return {
                ...state,
                isFetchingMore: true
            };
        case MovieActionTypes.FETCH_MORE_MOVIES_SUCCESS:
            return {
                ...state,
                searchData: {
                    ...(state.searchData as IMoviesSearchData),
                    results: {
                        ...(state.searchData as IMoviesSearchData).results,
                        ...action.payload.data
                    },
                    page: action.payload.fetchedPage
                },
                apiFetchedPages: [...state.apiFetchedPages, action.payload.fetchedPage],
                isFetchingMore: false
            };
        case MovieActionTypes.FETCH_MORE_MOVIES_FAILURE:
            return {
                ...state,
                searchError: action.payload,
                isFetchingMore: false
            };
        default:
            return state;
    }
};

export default moviesReducer;
