import React, {FC} from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MovieResultItem from "../movie-result-item/movie-result-item.component";
import {connect} from "react-redux";
import {AppState} from "../../redux/root-reducer";
import {selectMovies} from "../../redux/movies/movies.selectors";

interface OwnProps {}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const MovieResultsContainer: FC<Props> = ({ movies }) => {
  let errorMarkup;
  // TODO: handle isFetching
  let { searchError, isFetching, searchResults } = movies;

  if (searchResults && searchResults.total_results === 0)
    searchError = { errors: ["No results found."] };

  if (searchError)
    errorMarkup = (
      <div>
        {searchError?.errors.map((message, i) => (
          <div style={{ color: "red" }}>
            {i + 1}) {message}
          </div>
        ))}
      </div>
    );

  return (
    <Container>
      {isFetching && <h4 style={{color: '#F7FF8E'}}>Loading...</h4>}
      {errorMarkup ? (
        errorMarkup
      ) : (
        <Grid container alignItems="stretch" spacing={2}>
          {searchResults?.results.map(movie => (
            <Grid key={movie.id} item xs={12} sm={6} md={4}>
              <MovieResultItem movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

// const mapStateToProps = (state: AppState) => ({
//   movies: state.movies
// });

const mapStateToProps = (state: AppState) => ({
  movies: selectMovies(state)
});

export default connect(mapStateToProps)(MovieResultsContainer);
