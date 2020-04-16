import React, { FC, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { AppState } from "../../redux";
import { bindActionCreators, Dispatch } from "redux";
import { IMoviesActions } from "../../redux/movies";
import { checkIfFetchMore, clearFetchedMovies, fetchMoviesAsync } from "../../redux/movies/movies.actions";
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
import { getHashPath, getHashQuery } from "../../util/utilityFunctions";

let { perPageResultsItems } = appProperties;

function onHashChange(e: HashChangeEvent) {
	const pathURL = e.newURL.split("#")[1];
	const [locationPath, searchQuery = ''] = pathURL.split("?");
	sessionStorage.setItem(locationPath, searchQuery);
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

let isMounted = false;
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
		if (currentValue !== currentResultsSearchTerm && currentValue) {
			onFetchMoviesAsync(currentValue);
		}
	});

	// Effect to clear searchPage component upon empty parameters or sync state with searchParams
	useEffect(() => {
		if (!isMounted) return;

		if (!currentPage && !currentSearchTerm && totalResults)
			onClearFetchedMovies();
		else if (currentSearchTerm && totalResults && !currentPage)
			setCurrentPage(1)
	}, [currentPage, currentSearchTerm, totalResults]);


	// On mount effect
	useEffect(() => {
		isMounted =true;
		return () => {
			isMounted = false;
			window.removeEventListener("hashchange", onHashChange);
		}
	}, []);

	useLayoutEffect(() => {
		const hashPath = getHashPath();
		const searchParamsSaved = sessionStorage.getItem(hashPath);

		if (searchParamsSaved && !getHashQuery()) // Total pages to browse with effect to keep sync
			window.location.hash = hashPath + "?" + searchParamsSaved;

		window.addEventListener("hashchange", onHashChange);
		return () => window.removeEventListener("hashchange", onHashChange)
	}, [])

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
					: <MovieResultsContainer page={currentPage}/>
			}
		</div>
	), [currentPage, isFetching, searchError, totalPages, totalResults]);
};


const mapStateToProps = (state: AppState) => ({
	totalResults: state.movies.searchData?.total_results ?? 0,
	searchError: state.movies.searchError,
	isFetching: state.movies.isFetching,
	currentResultsSearchTerm: state.movies.currentSearchTerm
});

const mapDispatchToProps = (dispatch: Dispatch<IMoviesActions>) =>
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