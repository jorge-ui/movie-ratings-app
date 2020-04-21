import { ISearchActions } from "./search";
import { IMovieViewActions } from "./movie-view";
import rootReducer from "./root-reducer";
import { IListItemsActions } from "./item-list";

export type AppActions =
	| ISearchActions
	| IMovieViewActions
	| IListItemsActions;

export { default as store } from './store'

export type AppState = ReturnType<typeof rootReducer>;