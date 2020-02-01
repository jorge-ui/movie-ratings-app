import MoviesSearchData from "../../interfaces/app-types/MoviesSearchData";
import MoviesSearchError from "../../interfaces/app-types/MoviesSearchError";
import {
  MovieActionTypes,
  MoviesActions
} from "../../interfaces/action-types/MoviesActions";

export interface MoviesState {
  searchResults: MoviesSearchData | null;
  searchError: MoviesSearchError | null;
  isFetching: boolean;
}

const INITIAL_STATE: MoviesState = {
  searchResults: null,
  searchError: null,
  isFetching: false
};

const moviesReducer = (
  state = INITIAL_STATE,
  { type, payload }: MoviesActions
): MoviesState => {
  switch (type) {
    case MovieActionTypes.FETCH_MOVIES_START:
      return {
        ...state,
        isFetching: true
      };
    case MovieActionTypes.FETCH_MOVIES_SUCCESS:
      return {
        searchError: null,
        searchResults: payload,
        isFetching: false
      };
    case MovieActionTypes.FETCH_MOVIES_FAILURE:
      return {
        ...state,
        searchError: payload,
        isFetching: false
      };
    default:
      return state;
  }
};

export default moviesReducer;