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
import {easeOutQuad} from '../../util/easingFuctions';
import {Transition} from "react-spring/renderprops";

const {perPageResultsItems} = appProperties;

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

        let {totalApiPages, apiFetchedPages} = this.props;

        let totalViewedOnPortion = currentPage * perPageResultsItems;
        let nextPageOnApi = Math.ceil((totalViewedOnPortion + perPageResultsItems) / 20);
        if (nextPageOnApi <= totalApiPages && !apiFetchedPages.includes(nextPageOnApi) && !window.apiNowFetchingPages.has(nextPageOnApi))
            this.props.fetchMoreMoviesAsync(nextPageOnApi);
    };

    goToNextPage = () => {
        let {currentPage, totalPages} = this.state;
        if (currentPage < totalPages) {
            this.checkIfFetchMore(currentPage+1);
            this.setState({
                currentPage: currentPage + 1
            });
        }
    };
    goToPreviousPage = () => {
        let {currentPage} = this.state;
        if (currentPage > 1)
            this.setState({
                currentPage: currentPage-1
            });
    };

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        if(nextProps.isFetching !== this.props.isFetching)
            return true;
        else if(nextState.currentPage !== this.state.currentPage)
            return true;
        else return nextProps.apiFetchedPages.length !== this.props.apiFetchedPages.length;
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        prevPage = this.state.currentPage;
        let {currentSearchTerm: prevCurrentSearchTerm} = prevProps;
        let {currentSearchTerm, totalResults} = this.props;

        if(prevCurrentSearchTerm !== currentSearchTerm && !!currentSearchTerm) {
            this.setState({
                currentPage: 1,
                totalPages: Math.ceil(totalResults/perPageResultsItems)
            });
        }
    }

    render() {
        let {
            totalResults,
            currentSearchTerm,
            searchError,
            isFetching
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
                                <animated.div key={item} style={props} className={styles.animated}>
                                    <MovieResultsContainer page={item}/>
                                </animated.div>
                            }
                        </Transition>
                }
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
    isFetching: selectMoviesIsFetching(state)
});

const mapDispatchToProps = (dispatch: Dispatch<IMoviesActions>) =>
    bindActionCreators(
        {
            fetchMoreMoviesAsync
        },
        dispatch
    );

function getTransitionConfig(isNextSlide: boolean) {
    let xOffset = "7%";
    return {
        from: {
            opacity: -.2,
            transform: `translateX(${(isNextSlide ? '' : '-')+xOffset})`
        },
        enter: {
            opacity: 1,
            transform: 'translateX(0.0%)'
        },
        leave: {
            opacity: -.2,
            transform: `translateX(${(isNextSlide ? '-' : '')+xOffset})`
        },
        config: {
            duration: 400,
            easing: easeOutQuad,
        },
        unique: true
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);