import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import { HomePageActions } from '.';
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";
import { goFetch } from "../../util/utilityFunctions";
import IMoviesSearchResponseData from "../../interfaces/app-types/IMoviesSearchResponseData";

const thisWeekUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_API_KEY}`;
const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}`;

export enum HomePageActionTypes {
	FETCH_THIS_WEEK_START = "SET_THIS_WEEK_START",
	FETCH_THIS_WEEK_SUCCESS = "SET_THIS_WEEK_SUCCESS",
	FETCH_THIS_WEEK_FAILURE = "SET_THIS_WEEK_FAILURE",
	FETCH_NOW_PLAYING_START = "SET_NOW_PLAYING_START",
	FETCH_NOW_PLAYING_SUCCESS = "SET_NOW_PLAYING_SUCCESS",
	FETCH_NOW_PLAYING_FAILURE = "SET_NOW_PLAYING_FAILURE",
}

export const fetchThisWeekAsync = ():
	ThunkAction<void, AppState, null, HomePageActions> => async (dispatch) => {

	dispatch(fetchThisWeekStart());

	goFetch<IMoviesSearchResponseData>(thisWeekUrl)
		.then(({results}) => {
			dispatch(fetchThisWeekSuccess([results[0], results[1], results[2]]))
		})
		.catch((error: IMoviesSearchError) => {
			dispatch(fetchThisWeekFailure(error))
		})
};


export const fetchNowPlayingAsync = ():
	ThunkAction<void, AppState, null, HomePageActions> => async (dispatch) => {

	dispatch(fetchNowPlayingStart());

	goFetch<IMoviesSearchResponseData>(nowPlayingUrl)
		.then(({results}) => {
			dispatch(fetchNowPlayingSuccess(results))
		})
		.catch((error: IMoviesSearchError) => {
			dispatch(fetchNowPlayingFailure(error))
		})

};

const fetchThisWeekStart = (): HomePageActions => ({
	type: HomePageActionTypes.FETCH_THIS_WEEK_START,
});

const fetchThisWeekSuccess =
	(thisWeekItems: [IMovieResultItem, IMovieResultItem, IMovieResultItem]): HomePageActions => ({
		type: HomePageActionTypes.FETCH_THIS_WEEK_SUCCESS,
		payload: thisWeekItems
	});

const fetchThisWeekFailure = (error: IMoviesSearchError): HomePageActions => ({
	type: HomePageActionTypes.FETCH_THIS_WEEK_FAILURE,
	payload: error
});

const fetchNowPlayingStart = (): HomePageActions => ({
	type: HomePageActionTypes.FETCH_NOW_PLAYING_START,
});

const fetchNowPlayingSuccess =
	(nowPlayingItems: IMovieResultItem[]): HomePageActions => ({
		type: HomePageActionTypes.FETCH_NOW_PLAYING_SUCCESS,
		payload: nowPlayingItems
	});

const fetchNowPlayingFailure = (error: IMoviesSearchError): HomePageActions => ({
	type: HomePageActionTypes.FETCH_NOW_PLAYING_FAILURE,
	payload: error
});