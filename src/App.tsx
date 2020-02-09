import React from "react";
import MovieResultsContainer from "./components/movie-results-container/movie-results-container.component";
import AppBar from "./components/app-bar/app-bar.component";
import Container from "@material-ui/core/Container";
import SearchBar from "./components/search-bar/search-bar.component";
import PaginationControls from "./components/pagination-controls/pagination-controls.component";
import styles from './App.module.scss';

/*
* TODO: introduce 9perPageItem pagination navigation
*   - search-bar.component => (
*       * has fetchAsyncAction & currentSearchKeyword, (perform fetch & not for matching currentKeyword being same)
*   - pagination-controls.component => (
*       * has (paginationInfo || null):state & (nextPage && previousPage):actions
*   - movie-results-container.component => (
*       * receives "(9||rest)items of moviesResults" || "error" || "fetching"
* */

const App: React.FC = () => {
    return (
        <div className={styles.root}>
            <AppBar/>
            <Container>
                <div className={styles.searchHead}>
                    <SearchBar/>
                    <PaginationControls/>
                </div>
                <MovieResultsContainer/>
            </Container>
        </div>
    );
};

export default App;
