import { ISearchActions } from "./movies-browser";
import { IMovieViewActions } from "./movie-view";
import { ThunkAction } from "redux-thunk";
import { Action, AnyAction } from "redux";
import rootReducer from "./root-reducer";
import store from "./store";

export type AppActions =
	| ISearchActions
	| IMovieViewActions

export { default as store } from './store'

export type AppState = ReturnType<typeof rootReducer>

export default store;

export type AppThunk<A extends Action = AnyAction> = ThunkAction<void, AppState, null, A>