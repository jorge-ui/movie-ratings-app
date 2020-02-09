import MoviesSearchData from "../../interfaces/app-types/MoviesSearchData";
import MoviesSearchError from "../../interfaces/app-types/MoviesSearchError";
import {
    MovieActionTypes,
    MoviesActions
} from "../../interfaces/action-types/MoviesActions";
import {ThunkAction} from "redux-thunk";
import {AppState} from "../root-reducer";

const {REACT_APP_API_KEY} = process.env;

export const fetchMoviesStart = (): MoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_START
});

export const fetchMoviesSuccess = (data: MoviesSearchData): MoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_SUCCESS,
    payload: data
});

export const fetchMoviesFailure = (error: MoviesSearchError): MoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_FAILURE,
    payload: error
});

export const fetchMoviesAsync = (
    searchTerm: string
): ThunkAction<void, AppState, null, MoviesActions> => async dispatch => {
    // Start
    dispatch(fetchMoviesStart());

    try {
        let res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${REACT_APP_API_KEY}&query=${searchTerm}`
        );

        if (res.status !== 200) {
            let error: MoviesSearchError = await res.json();
            dispatch(fetchMoviesFailure(error)); // Failure
        } else {
            let data: MoviesSearchData = await res.json();
            dispatch(fetchMoviesSuccess(data)); // Success
        }
    } catch (error) {
        dispatch(
            fetchMoviesFailure({
                errors: ["Internal server error."] // Failure
            })
        );
    }
};
