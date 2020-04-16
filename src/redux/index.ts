import { IMoviesActions } from "./movies";
import { MovieViewActions } from "./movie-view";
import rootReducer from "./root-reducer";

export type AppActions = IMoviesActions | MovieViewActions;

export { default as store } from './store'

export type AppState = ReturnType<typeof rootReducer>;