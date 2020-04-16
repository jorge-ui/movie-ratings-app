import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import { MovieViewActions } from "./";

export enum MovieViewActionsTypes {
	SET_MOVIE_VIEW = 'SET_MOVIE_VIEW',
	CLEAR_MOVIE_VIEW = 'CLEAR_MOVIE_VIEW'
}

export const setMovieView = (item: IMovieResultItem): MovieViewActions => ({
	type: MovieViewActionsTypes.SET_MOVIE_VIEW,
	payload: item
});

export const clearMovieView = (): MovieViewActions => ({
	type: MovieViewActionsTypes.CLEAR_MOVIE_VIEW,
});