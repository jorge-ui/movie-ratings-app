import { IMoviesActions } from "./movies";
import { IMovieViewActions } from "./movie-view";
import rootReducer from "./root-reducer";
import { IListItemsActions } from "./item-list";

export type AppActions =
	| IMoviesActions
	| IMovieViewActions
	| IListItemsActions;

export { default as store } from './store'

export type AppState = ReturnType<typeof rootReducer>;