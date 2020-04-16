import { createSelector, Selector } from "reselect";
import { AppState } from "../";
import { MoviesState } from "./movies.reducer";
import IMoviesSearchData from "../../interfaces/app-types/IMoviesSearchData";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import appProperties from "../../appProperties";

const {perPageResultsItems} = appProperties;

export const getMoviesState: Selector<AppState, MoviesState> = state =>
    state.movies;

const selectMoviesFetchedPagesLength = createSelector(
    [getMoviesState],
    (movies) => movies.apiFetchedPages.length
);

const selectMoviesSearchData = createSelector(
    [getMoviesState],
    movies => movies.searchData
);


export const selectMoviesTotalResultsFound = createSelector(
    [selectMoviesSearchData],
    (searchData) => searchData ? searchData.total_results : 0
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



