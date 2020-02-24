import React from "react";
import Grid from "@material-ui/core/Grid";
import MovieResultItem from "../movie-result-item/movie-result-item.component";
import styles from "./movie-results-container.module.scss";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import {AppState} from "../../redux/root-reducer";
import {makeSelectMoviesResultsPortion} from "../../redux/movies/movies.selectors";
import {connect} from "react-redux";
import MovieResultItemSkeleton from "../movie-result-item-skeleton/movie-result-item-skeleton.component";

interface OwnProps {
    className?: string,
    page: number
}

type Props = OwnProps & ReturnType<ReturnType<typeof makeMapStateToProps>>;

class MovieResultsContainer extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
        let {resultsPortion} = this.props;
        let {resultsPortion: nextResultsPortion} = nextProps;
        return resultsPortion[resultsPortion.length - 1].id !== nextResultsPortion[nextResultsPortion.length - 1].id;
    }

    render() {
        let {resultsPortion, className} = this.props;
        return (
            <Grid container alignItems="stretch" spacing={2} className={styles.root + " " + className}>
                {resultsPortion.map(movie => {
                    return (
                        <Grid key={movie.key} item xs={12} sm={6} md={4}>
                            {!!(movie as IMovieResultItem).id
                                ? <MovieResultItem movie={(movie as IMovieResultItem)}/>
                                : <MovieResultItemSkeleton/>}
                        </Grid>
                    );
                })}
            </Grid>
        );

    }
}

const makeMapStateToProps = () => {
    const selectMoviesResultsPortion = makeSelectMoviesResultsPortion();
    return (state: AppState, props: OwnProps) => ({
        resultsPortion: selectMoviesResultsPortion(state, props)
    });
};

export default connect(makeMapStateToProps)(MovieResultsContainer);
