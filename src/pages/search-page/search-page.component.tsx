import React from 'react';
import SearchBar from "../../components/search-bar/search-bar.component";
import TotalSearchResults from "../../components/total-search-results/total-search-results.component";
import PaginationControls from "../../components/pagination-controls/pagination-controls.component";
import MovieResultsContainer from "../../components/movie-results-container/movie-results-container.component";
import styles from './search-page.module.scss';
import {AppState} from "../../redux/root-reducer";
import {
    selectMoviesCurrentSearchTerm,
    selectMoviesFetchedPages,
    selectMoviesIsFetching,
    selectMoviesSearchError,
    selectMoviesTotalPages,
    selectMoviesTotalResultsFound
} from "../../redux/movies/movies.selectors";
import {bindActionCreators, Dispatch} from "redux";
import {IMoviesActions} from "../../interfaces/action-types/IMoviesActions";
import {fetchMoreMoviesAsync} from "../../redux/movies/movies.actions";
import {connect} from "react-redux";
import appProperties from "../../appProperties";
import ErrorMessage from "../../components/error-message/error-message.component";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner.component";
import {animated} from "react-spring";
import {Transition} from "react-spring/renderprops";
import MovieItemView from "../../components/movie-item-view/movie-item-view.component";

const {perPageResultsItems, searchPageTransitionConfig} = appProperties;

interface State {
    currentPage: number,
    totalPages: number
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
let prevPage: number;

class SearchPage extends React.Component<Props, State> {
    state = {
        currentPage: 0,
        totalPages: 0
    };

    checkIfFetchMore = (currentPage: number) => {
        if (!currentPage) return; // do nothing

        let {totalApiPages, apiFetchedPages, onFetchMoreMoviesAsync} = this.props;

        let totalViewedOnPortion = currentPage * perPageResultsItems;
        let nextPageOnApi = Math.ceil((totalViewedOnPortion + perPageResultsItems) / 20);
        if (nextPageOnApi <= totalApiPages && !apiFetchedPages.includes(nextPageOnApi) && !window.apiNowFetchingPages.has(nextPageOnApi))
            setTimeout(() => onFetchMoreMoviesAsync(nextPageOnApi), 250);
    };

    goToNextPage = () => {
        let {currentPage, totalPages} = this.state;
        if (currentPage < totalPages) {
            let nextPage = currentPage + 1;
            this.checkIfFetchMore(nextPage);
            this.setState({
                currentPage: nextPage
            });
        }
    };
    goToPreviousPage = () => {
        let {currentPage} = this.state;
        if (currentPage > 1)
            this.setState({
                currentPage: currentPage - 1
            });
    };

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        let {state: nowState, props: nowProps} = this;
        if (nextProps.isFetching !== nowProps.isFetching)
            return true;
        else if (nextState.currentPage !== nowState.currentPage || (nextState.totalPages !== nowState.totalPages && nextState.totalPages))
            return true;
        else return nextProps.apiFetchedPages.length !== nowProps.apiFetchedPages.length;
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        prevPage = this.state.currentPage;
        let {currentSearchTerm: prevCurrentSearchTerm} = prevProps;
        let {currentSearchTerm, totalResults} = this.props;

        if (prevCurrentSearchTerm !== currentSearchTerm && !!currentSearchTerm) {
            this.setState({
                currentPage: 1,
                totalPages: Math.ceil(totalResults / perPageResultsItems)
            });
        }
    }

    render() {
        let {
            totalResults,
            currentSearchTerm,
            searchError,
            isFetching,
        } = this.props;
        let {currentPage, totalPages} = this.state;

        const isNextSlide = prevPage === undefined || prevPage < currentPage;
        return (
            <div className={styles.root}>
                <div className={styles.searchHead}>
                    <SearchBar currentSearchTerm={currentSearchTerm}/>
                    {!!totalResults && <TotalSearchResults totalResults={totalResults}/>}
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        goToNextPage={this.goToNextPage}
                        goToPreviousPage={this.goToPreviousPage}
                    />
                </div>
                {isFetching ? <LoadingSpinner/>
                    : searchError ? <ErrorMessage error={searchError}/>
                        : !!currentPage &&
                        <Transition items={currentPage} keys={currentPage} {...getTransitionConfig(isNextSlide)}>
                            {item => props =>
                                <animated.div key={item} style={props} className={`${styles.animated} transition-page`}>
                                    <MovieResultsContainer page={item}/>
                                </animated.div>
                            }
                        </Transition>
                }
                <MovieItemView/>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    totalResults: selectMoviesTotalResultsFound(state),
    currentSearchTerm: selectMoviesCurrentSearchTerm(state),
    apiFetchedPages: selectMoviesFetchedPages(state),
    totalApiPages: selectMoviesTotalPages(state),
    searchError: selectMoviesSearchError(state),
    isFetching: selectMoviesIsFetching(state),
});

const mapDispatchToProps = (dispatch: Dispatch<IMoviesActions>) =>
    bindActionCreators(
        {
            onFetchMoreMoviesAsync: fetchMoreMoviesAsync
        },
        dispatch
    );

function getTransitionConfig(isNextSlide: boolean) {
    let xOffset = "7%";
    return {
        initial: {
            opacity: 0,
            transform: `translateX(0.0)`,
        },
        from: {
            opacity: -.2,
            transform: `translateX(${(isNextSlide ? '' : '-') + xOffset})`
        },
        enter: {
            opacity: 1,
            transform: 'translateX(0.0%)'
        },
        leave: {
            opacity: -.2,
            transform: `translateX(${(isNextSlide ? '-' : '') + xOffset})`
        },
        config: searchPageTransitionConfig,
        unique: true,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);