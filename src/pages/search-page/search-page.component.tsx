import React, { FC, useEffect } from "react";
import SearchBar from "components/search-bar";
import PaginationControls from "components/pagination-controls";
import LoadingSpinner from "components/loading-spinner";
import MovieResultsContainer from "components/movie-results-container";
import ErrorMessage from "components/error-message";
import TotalSearchResults from "components/total-search-results";
import styles from "./search-page.module.scss";
import useSearchParam from "hooks/useSearchParam";
import useSavedSessionParams from "hooks/useSavedSessionParams";
import MoviesGrid from "components/movies-grid";
import useMovieItems from "hooks/useMovieItems";


const SearchPage: FC = () => {

	useSavedSessionParams();


	const [searchQuery = ''] = useSearchParam("s");

	const {items, isLoading, pageUI, totalPagesUI, totalResults, goToPage, error } =
		useMovieItems({name: "search", searchQuery});




	// This effect is to keep the paging declared on searchParams in sync totalPages max
	useEffect(() => {
		if (pageUI > totalPagesUI && totalPagesUI)
			goToPage(totalPagesUI);
	}, [goToPage, pageUI, totalPagesUI]);

	console.log("items", items);
	return (
		<div className={styles.root}>
			<div className={styles.searchHead}>
				<SearchBar/>
				{!!totalResults && <TotalSearchResults totalResults={totalResults}/>}
				<PaginationControls totalPages={totalPagesUI} />
			</div>
			{isLoading ? <LoadingSpinner delay={800} fixed />
				: error ? <ErrorMessage error={error}/>
					: (
						<MovieResultsContainer page={pageUI}>
							{() => <MoviesGrid items={items}/>}
						</MovieResultsContainer>
					)
			}
		</div>
	);
};

export default SearchPage;