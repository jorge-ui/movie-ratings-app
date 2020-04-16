import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import MovieResultItem from "../movie-result-item/movie-result-item.component";
import styles from "./movie-results-container.module.scss";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import { AppState } from "../../redux";
import { makeSelectMoviesResultsPortion } from "../../redux/movies/movies.selectors";
import { connect } from "react-redux";
import MovieResultSkeleton from "../movie-result-skeleton/movie-result-skeleton.component";
import { animated, useTransition, UseTransitionProps } from "react-spring";
import usePrevious from "../../util/custom-hooks/usePrevious";
import appProperties from "../../appProperties";

let { searchPageTransitionConfig } = appProperties;

interface OwnProps {
    page: number
}

type Props = OwnProps;

const MovieResultsContainer: FC<Props> = ({page}) => {

    const prevPage = usePrevious(page);
    const isNextSlide = !prevPage || prevPage < page;
    const transition = useTransition(page, page, getTransitionConfig(isNextSlide));

    return (
        <>
            {transition.map(({key, props, item: page}) => page ?
                <animated.div key={key} style={props as any} className={`${styles.root} transition-page`}>
                    <ConnectedMoviesGrid page={page}/>
                </animated.div> : null
            )}
        </>
    )
};

type ChildProps = {page: number} & ReturnType<ReturnType<typeof makeMapStateToProps>>

const MoviesGrid: FC<ChildProps> = ({resultsPortion}) => (
    <Grid container alignItems="stretch" spacing={2} className={styles.grid}>
        {resultsPortion.map(movie => (
            <Grid key={movie.key} item xs={12} sm={6} md={4}>
                {!!(movie as IMovieResultItem).id
                    ? <MovieResultItem movie={(movie as IMovieResultItem)}/>
                    : <MovieResultSkeleton/>}
            </Grid>
        ))}
    </Grid>
);
const ConnectedMoviesGrid = connect(makeMapStateToProps)(MoviesGrid);


function makeMapStateToProps() {
    const selectMoviesResultsPortion = makeSelectMoviesResultsPortion();
    return (state: AppState, props: OwnProps) => ({
        resultsPortion: selectMoviesResultsPortion(state, props)
    });
}

function getTransitionConfig(isNextSlide: boolean): UseTransitionProps<number> {
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


export default React.memo(MovieResultsContainer);
