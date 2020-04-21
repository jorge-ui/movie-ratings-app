import React, { FC, useEffect, useMemo, useState } from 'react';
import { AppState } from "../../redux";
import { bindActionCreators, Dispatch } from "redux";
import { ISearchActions } from "../../redux/search";
import { checkIfFetchMore, clearFetchedMovies, fetchMoviesAsync } from "../../redux/search/search.actions";
import { connect } from "react-redux";
import SearchBar from "../../components/search-bar/search-bar.component";
import PaginationControls from "../../components/pagination-controls/pagination-controls.component";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner.component";
import MovieResultsContainer from "../../components/movie-results-container/movie-results-container.component";
import ErrorMessage from "../../components/error-message/error-message.component";
import TotalSearchResults from "../../components/total-search-results/total-search-results.component";
import styles from './search-page.module.scss';
import useSearchParam from "../../util/custom-hooks/useSearchParam";
import appProperties from "../../appProperties";
import useSavedSessionParams from "../../util/custom-hooks/useSavedSessionParams";
import useEffectSkipFirst from "../../util/custom-hooks/useEffectSkipFirst";
import MoviesGrid from "../../components/movies-grid/movies-grid.component";

const { perPageResultsItems } = appProperties;


type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const SearchPage: FC<Props> = props => {
	const {
		totalResults, onCheckIfFetchMore, isFetching, searchError,
		onFetchMoviesAsync, onClearFetchedMovies, currentResultsSearchTerm
	} = props;

	// "page" searchParam from URLSearchParameter with onParamChange handler (custom hook)
	const [currentPage = 0, setCurrentPage] = useSearchParam("page", currentValue => {
		onCheckIfFetchMore(Number(currentValue));
	});

	const [currentSearchTerm = ''] = useSearchParam("s", (currentValue) => {
		if (currentValue !== currentResultsSearchTerm && currentValue)
			onFetchMoviesAsync(currentValue);
	});

	// Effect to clear searchPage component upon empty parameters or sync state with searchParams
	useEffectSkipFirst(() => {
		if (!currentPage && !currentSearchTerm && totalResults)
			onClearFetchedMovies();
		else if (currentSearchTerm && totalResults && !currentPage)
			setCurrentPage(1)
	}, [currentPage, currentSearchTerm, totalResults]);

	useSavedSessionParams();

	const [totalPages, setTotalPages] = useState(Math.ceil(totalResults / perPageResultsItems));
	useEffect(() => {
		setTotalPages(Math.ceil(totalResults / perPageResultsItems));
	}, [totalResults]);


	// This effect is to keep the paging declared on searchParams in sync totalPages max
	useEffect(() => {
		if (!totalPages) return;
		if (currentPage > totalPages)
			setCurrentPage(totalPages);
		else onCheckIfFetchMore(Number(currentPage))
	}, [currentPage, totalPages]);


	return useMemo(() => (
		<div className={styles.root}>
			<div className={styles.searchHead}>
				<SearchBar/>
				{!!totalResults && <TotalSearchResults totalResults={totalResults}/>}
				<PaginationControls totalPages={totalPages} />
			</div>
			{isFetching ? <LoadingSpinner delay={800} />
				: searchError ? <ErrorMessage error={searchError}/>
					: (
						<MovieResultsContainer page={currentPage}>
							{page => <MoviesGrid page={page}/>}
						</MovieResultsContainer>
					)
			}
		</div>
	), [currentPage, isFetching, searchError, totalPages, totalResults]);
};


const mapStateToProps = (state: AppState) => ({
	totalResults: state.search.searchData?.total_results ?? 0,
	searchError: state.search.searchError,
	isFetching: state.search.isFetching,
	currentResultsSearchTerm: state.search.currentSearchTerm
});

const mapDispatchToProps = (dispatch: Dispatch<ISearchActions>) =>
	bindActionCreators(
		{
			onFetchMoviesAsync: fetchMoviesAsync,
			onClearFetchedMovies: clearFetchedMovies,
			onCheckIfFetchMore: checkIfFetchMore
		},
		dispatch
	);

export default connect(mapStateToProps, mapDispatchToProps)(
	React.memo<Props>(SearchPage, (prevProps, nextProps) => {
		for (let key in prevProps) {
			let prevValue = prevProps[key as keyof typeof prevProps];
			let nextValue = nextProps[key as keyof typeof nextProps];

			if (typeof prevValue !== "object") { // primitive value
				if (prevValue !== nextValue)
					return false;
			} else if (Array.isArray(prevValue)) { // array value
				if (prevValue.length !== (nextValue as any[]).length)
					return false;
			} else if (JSON.stringify(prevValue) !== JSON.stringify(nextValue)) // object value
				return false;
		}
		return true;
	})
) as FC;