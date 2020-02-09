import React, {FC, useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import MovieResultItem from "../movie-result-item/movie-result-item.component";
import {connect} from "react-redux";
import {AppState} from "../../redux/root-reducer";
import {selectMoviesState} from "../../redux/movies/movies.selectors";
import {TweenMax} from "gsap";
import {isMobile} from "../../util/utilityFunctions";
import styles from "./movie-results-container.module.scss";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";

interface OwnProps {}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const MovieResultsContainer: FC<Props> = ({ movies }) => {
  let errorMarkup;
  // TODO: handle isFetching
  let { searchError, isFetching, searchResults } = movies;

  let results = searchResults?.results;

  useEffect(() => {
    if (!isMobile())
      TweenMax.from(".movie-item", 0.7, {
        opacity: -3,
        transform: "scale(0.7)",
        ease: "power4.out",
        stagger: 0.08
      });
  }, [results]);

  useEffect(() => {
    if (isFetching) {
      TweenMax.to(".movie-item", 0.5, {
        opacity: -.5,
        ease: "none"
      });
    }
  }, [isFetching]);

  if (searchResults && searchResults.total_results === 0)
    searchError = { errors: ["No results found."] };

  if (searchError)
    errorMarkup = (
      <div>
        {searchError?.errors.map((message, i) => (
          <div key={i} style={{ color: "red" }}>
            {i + 1}) {message}
          </div>
        ))}
      </div>
    );

  return (
    <div className={styles.root}>
      {isFetching && <LoadingSpinner className={styles.spinner}/>}
      <Grid container alignItems="stretch" spacing={2}>
        {errorMarkup
          ? errorMarkup
          : results?.map(movie => (
              <Grid key={movie.id} item xs={12} sm={6} md={4}>
                <MovieResultItem movie={movie} />
              </Grid>
            ))}
      </Grid>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  movies: selectMoviesState(state)
});

export default connect(mapStateToProps)(MovieResultsContainer);
