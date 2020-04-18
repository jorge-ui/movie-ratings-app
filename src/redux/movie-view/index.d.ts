// Type definitions for movies.action
// Project: movie-ratings-app
// Definitions by: Jorge L. Rivera <jrdeveloper.me>

import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import { MovieViewActionsTypes } from "./movie-view.actions";

interface ISetMovieView {
	type: typeof MovieViewActionsTypes.SET_MOVIE_VIEW,
	payload: IMovieResultItem
}

interface IClearMovieView {
	type: typeof MovieViewActionsTypes.CLEAR_MOVIE_VIEW,
}

export type IMovieViewActions =
	| ISetMovieView
	| IClearMovieView