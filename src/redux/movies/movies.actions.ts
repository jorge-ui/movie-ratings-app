import MoviesSearchData from "../../interfaces/app-types/MoviesSearchData";
import MoviesSearchError from "../../interfaces/app-types/MoviesSearchError";
import {MovieActionTypes, MoviesActions} from "../../interfaces/action-types/MoviesActions";
import {Dispatch} from "redux";
import {wait} from "../../util/utilityFunctions";


export const fetchMoviesStart = (): MoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_START,
});

export const fetchMoviesSuccess = (data: MoviesSearchData): MoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_SUCCESS,
    payload: data
});

export const fetchMoviesFailure = (error: MoviesSearchError): MoviesActions => ({
    type: MovieActionTypes.FETCH_MOVIES_FAILURE,
    payload: error
});

export const fetchMoviesAsync = (searchTerm:string) => async (dispatch: Dispatch<MoviesActions>) => {
    // Start

    dispatch(fetchMoviesStart());

    await wait(600);
    let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=a44864e428db2c92b5da8792195a9779&query=${searchTerm}`);

    try {
        if (res.status !== 200){
            let error: MoviesSearchError = await res.json();
            return dispatch(fetchMoviesFailure(error)); // Failure
        }
        else {
            let data: MoviesSearchData = await res.json();
            return dispatch(fetchMoviesSuccess(data));// Success
        }
    } catch (error) {
        return dispatch(fetchMoviesFailure({ // Failure
            errors: ["Something went terribly wrong."]
        }));
    }
};

