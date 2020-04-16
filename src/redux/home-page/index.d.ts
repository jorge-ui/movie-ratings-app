import { HomePageActionTypes } from "./home-page.actions";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";

export type ThisWeekSectionItems = [IMovieResultItem, IMovieResultItem, IMovieResultItem]
export type NowPlayingSectionItems = IMovieResultItem[]

interface IFetchThisWeekStart {
	type: HomePageActionTypes.FETCH_THIS_WEEK_START
}

interface IFetchThisWeekSuccess {
	type: HomePageActionTypes.FETCH_THIS_WEEK_SUCCESS,
	payload: ThisWeekSectionItems
}

interface IFetchThisWeekFailure {
	type:HomePageActionTypes.FETCH_THIS_WEEK_FAILURE,
	payload: IMoviesSearchError
}

interface IFetchNowPlayingStart {
	type: HomePageActionTypes.FETCH_NOW_PLAYING_START
}

interface IFetchNowPlayingSuccess {
	type: HomePageActionTypes.FETCH_NOW_PLAYING_SUCCESS,
	payload: NowPlayingSectionItems
}

interface IFetchNowPlayingFailure {
	type:HomePageActionTypes.FETCH_NOW_PLAYING_FAILURE,
	payload: IMoviesSearchError
}



export type HomePageActions =
	| IFetchThisWeekStart
	| IFetchThisWeekSuccess
	| IFetchThisWeekFailure
	| IFetchNowPlayingStart
	| IFetchNowPlayingSuccess
	| IFetchNowPlayingFailure