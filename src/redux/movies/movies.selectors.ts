import {createSelector, Selector} from "reselect";
import {AppState} from "../root-reducer";
import {MoviesState} from "./movies.reducer";
import IMoviesSearchData from "../../interfaces/app-types/IMoviesSearchData";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import appProperties from "../../appProperties";

const {perPageResultsItems} = appProperties;

export const getMoviesState: Selector<AppState, MoviesState> = state =>
    state.movies;

export const selectMoviesCurrentSearchTerm = createSelector(
    [getMoviesState],
    movies => movies.currentSearchTerm
);


const selectMoviesFetchedPagesLength = createSelector(
    [getMoviesState],
    (movies) => movies.apiFetchedPages.length
);

const selectMoviesSearchData = createSelector(
    [getMoviesState],
    movies => movies.searchData
);

export const selectMoviesFetchedPages = createSelector(
    [getMoviesState],
    (movies) => movies.apiFetchedPages
);

export const selectMoviesTotalResultsFound = createSelector(
    [selectMoviesSearchData],
    (searchData) => searchData ? searchData.total_results : 0
);

export const selectMoviesTotalPages = createSelector(
    [selectMoviesSearchData],
    (searchData) => searchData ? searchData.total_pages : 0
);

export const selectMoviesResultItems = createSelector(
    [selectMoviesSearchData, selectMoviesFetchedPagesLength],
    (searchData, fetchedPagesLength) => fetchedPagesLength > 0 ? (searchData as IMoviesSearchData).results : null
);

interface EmptyMovieItem {
    key: number,
    id?: undefined
}
const getPageFromProps = (state: object, props: {page: number}) => props.page;
export const makeSelectMoviesResultsPortion = () => createSelector(
    [selectMoviesResultItems, selectMoviesTotalResultsFound, getPageFromProps],
    (resultItems, totalResults, currentPage) => {
        let resultsPortion: (IMovieResultItem | EmptyMovieItem)[] = [];
        if (resultItems) {
            let grabIndex: number;
            let startIndex = (currentPage ? currentPage - 1 : currentPage) * perPageResultsItems;
            for (let i = 0; i < perPageResultsItems; i++)
                if ((grabIndex = startIndex + i) < totalResults) {
                    resultsPortion[i] = resultItems[grabIndex] || {key: grabIndex};
                    resultsPortion[i].key = grabIndex;
                }
        }
        return resultsPortion;
    }
);

export const selectMoviesSearchError = createSelector(
    [getMoviesState],
    movies => movies.searchError
);

export const selectMoviesIsFetching = createSelector(
    [getMoviesState],
    movies => movies.isFetching
);

export const selectMoviesIsFetchingMore = createSelector(
    [getMoviesState],
    movies => movies.isFetchingMore
);
