import IMoviesSearchData, { ResultItemsObject } from "../../interfaces/app-types/IMoviesSearchData";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import { AccountItemsNames, ISearchActions, MoviesBrowseNames } from "./";
import { ThunkAction } from "redux-thunk";
import { AppState, AppThunk } from "store";
import IMoviesResponseData from "../../interfaces/app-types/IMoviesResponseData";
import { calculatePageOnApi, convertResultsData, getSearchParam, goFetchPostersOnWorker } from "utility";
import appProperties from "../../appProperties";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";

const {buildFetchMovieSearchUrl, itemsPerPageUI, getItemsBrowseUrl} = appProperties;

export enum MoviesBrowserActionTypes {
    FETCH_MOVIES_START = "FETCH_MOVIES_START",
    FETCH_MOVIES_SUCCESS = "FETCH_MOVIES_SUCCESS",
    FETCH_MOVIES_FAILURE = "FETCH_MOVIES_FAILURE",
    FETCH_MORE_MOVIES_START = "FETCH_MORE_MOVIES_START",
    FETCH_MORE_MOVIES_SUCCESS = "FETCH_MORE_MOVIES_SUCCESS",
    FETCH_MORE_MOVIES_FAILURE = "FETCH_MORE_MOVIES_FAILURE",
    CLEAR_FETCHED_MOVIES = "CLEAR_FETCHED_MOVIES",
    UNSHIFT_TO_LIST_ITEMS = "UNSHIFT_TO_LIST_ITEMS", // these last two are for updating "favorite" and "watchlist"
    REMOVE_FROM_LIST_ITEMS = "REMOVE_FROM_LIST_ITEMS"
}

/**
 * @param name Values: "watchlist" & "favorite" need authentication
 * */
export default function getMoviesBrowserActions<T extends MoviesBrowseNames>(name: T) {

    let unshiftToFavorites: ((item: IMovieResultItem) => ISearchActions)|undefined = undefined;
    let removeFromListItems: ((id: number) => ISearchActions)|undefined = undefined;

    if (name === "favorite" || name === "watchlist") {
        unshiftToFavorites = (item: IMovieResultItem): ISearchActions => ({
            type: MoviesBrowserActionTypes.UNSHIFT_TO_LIST_ITEMS,
            payload: item,
            name: name as AccountItemsNames
        });

        removeFromListItems = (id: number): ISearchActions => ({
            type: MoviesBrowserActionTypes.REMOVE_FROM_LIST_ITEMS,
            payload: id,
            name: name as AccountItemsNames
        });
    }

    const browseActions = {
        clearFetchedMovies: (): ISearchActions => ({
            type: MoviesBrowserActionTypes.CLEAR_FETCHED_MOVIES,
            name
        }),

        fetchMoviesStart: (): ISearchActions => ({
            type: MoviesBrowserActionTypes.FETCH_MOVIES_START,
            name
        }),

        fetchMoviesSuccess: (data: IMoviesSearchData, searchTerm: string): ISearchActions => ({
            type: MoviesBrowserActionTypes.FETCH_MOVIES_SUCCESS,
            payload: {data, searchTerm},
            name
        }),

        fetchMoviesFailure: (error: IMoviesSearchError): ISearchActions => ({
            type: MoviesBrowserActionTypes.FETCH_MOVIES_FAILURE,
            payload: error,
            name
        }),

        fetchMoviesAsync(searchTerm: string = '', pageApi: number = 1): AppThunk<ISearchActions> {
            return async dispatch => {
                if (name === "search" && !searchTerm) return;
                // Start
                dispatch(this.fetchMoviesStart());
                try {
                    let res = await fetch(getItemsBrowseUrl(name, searchTerm, pageApi));
                    if (!res.ok) {
                        let error: IMoviesSearchError = await res.json();
                        dispatch(this.fetchMoviesFailure(error)); // Failure
                    } else {
                        let data: IMoviesResponseData = await res.json();

                        goFetchPostersOnWorker(data.results);

                        let transformedData: IMoviesSearchData = {
                            ...data,
                            results: convertResultsData(data.results, pageApi)
                        };

                        dispatch(this.fetchMoviesSuccess(transformedData, searchTerm)); // Success
                    }
                } catch (error) {
                    dispatch(
                        this.fetchMoviesFailure({
                            errors: ["Internal server error."] // Failure
                        })
                    );
                }
            };
        },

        fetchMoreMoviesStart: (): ISearchActions => ({
            type: MoviesBrowserActionTypes.FETCH_MORE_MOVIES_START,
            name
        }),

        fetchMoreMoviesSuccess: (results: ResultItemsObject, fetchedPage: number): ISearchActions => ({
            type: MoviesBrowserActionTypes.FETCH_MORE_MOVIES_SUCCESS,
            payload: {results, fetchedPage},
            name
        }),

        fetchMoreMoviesFailure: (error: IMoviesSearchError): ISearchActions => ({
            type: MoviesBrowserActionTypes.FETCH_MORE_MOVIES_FAILURE,
            payload: error,
            name
        }),

        fetchMoreMoviesAsync(nextPageOnApi: number, ...otherPagesOnApi: number[]):
            ThunkAction<void, AppState, null, ISearchActions> {
            return async (dispatch, getState) => {
                let searchTerm = getSearchParam("s") || '';
                // Start
                dispatch(this.fetchMoreMoviesStart());
                try {
                    let res = await fetch(getItemsBrowseUrl(name, searchTerm, nextPageOnApi));
                    if (!res.ok) {
                        let error: IMoviesSearchError = await res.json();
                        dispatch(this.fetchMoreMoviesFailure(error)); // Failure
                    } else {
                        let data: IMoviesResponseData = await res.json();

                        goFetchPostersOnWorker(data.results);

                        let resultsObject = convertResultsData(data.results, nextPageOnApi);

                        dispatch(this.fetchMoreMoviesSuccess(resultsObject, nextPageOnApi)) // Success
                    }
                } catch (error) {
                    dispatch(
                        this.fetchMoreMoviesFailure({
                            errors: ["Internal server error."] // Failure
                        })
                    );
                } finally {
                    if (otherPagesOnApi.length) {
                        // @ts-ignore
                        dispatch(this.fetchMoreMoviesAsync(...otherPagesOnApi))
                    }
                }
            }
        },

        checkIfFetchMore(pageUI: number): AppThunk<ISearchActions> {
            return async (dispatch, getState) => {
                if (!pageUI || name === "trendingWeek") return;
                const { apiFetchedPages, searchData, isFetchingMore } = getState()[name];

                if (isFetchingMore) return;

                const pageOnApi = calculatePageOnApi(pageUI);
                const nextUIPageOnApi = calculatePageOnApi(pageUI, "next")
                const total_pages = searchData?.total_pages || 0;

                const isFetchPage = (pageOnApi: number) =>
                    pageOnApi>0 && pageOnApi<=total_pages && !apiFetchedPages.includes(pageOnApi);

                const pagesToFetch: number[] = [];

                isFetchPage(nextUIPageOnApi)   && pagesToFetch.push(nextUIPageOnApi);
                isFetchPage(pageOnApi)         && pagesToFetch.push(pageOnApi);
                isFetchPage(pageOnApi-1)       && pagesToFetch.push(pageOnApi-1);
                isFetchPage(pageOnApi-2)       && pagesToFetch.push(pageOnApi-2);

                if (pagesToFetch.length) {
                    // @ts-ignore
                    dispatch(this.fetchMoreMoviesAsync(...pagesToFetch));
                }
            }
        },
        unshiftToFavorites: (unshiftToFavorites as T extends AccountItemsNames ? NonNullable<typeof unshiftToFavorites> : undefined),
        removeFromListItems: (removeFromListItems as T extends AccountItemsNames ? NonNullable<typeof removeFromListItems> : undefined),

    }

    return browseActions as T extends AccountItemsNames ? typeof browseActions : Omit<typeof browseActions, "unshiftToFavorites" | "removeFromListItems">
}
