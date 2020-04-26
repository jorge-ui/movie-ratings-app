import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import { IMovieViewActions } from "./";

export enum MovieViewActionsTypes {
	SET_MOVIE_VIEW = 'SET_MOVIE_VIEW',
	CLEAR_MOVIE_VIEW = 'CLEAR_MOVIE_VIEW'
}

export const setMovieView = (item: IMovieResultItem): IMovieViewActions => ({
	type: MovieViewActionsTypes.SET_MOVIE_VIEW,
	payload: item
});

export const clearMovieView = (): IMovieViewActions => ({
	type: MovieViewActionsTypes.CLEAR_MOVIE_VIEW,
});