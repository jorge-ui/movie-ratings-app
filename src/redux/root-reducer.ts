import {combineReducers} from "redux";
import moviesReducer from "./movies/movies.reducer";
import movieItemReducer from "./movie-item/movie-item.reducer";


const rootReducer = combineReducers({
  movies: moviesReducer,
  movieItem: movieItemReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
