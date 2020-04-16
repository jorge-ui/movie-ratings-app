import { combineReducers } from "redux";
import moviesReducer from "./movies/movies.reducer";
import movieViewReducer from "./movie-view/movie-view.reducer";
import homePageReducer from "./home-page/home-page.reducer";
import userReducer from "./user/user.reducer";


const rootReducer = combineReducers({
  movies: moviesReducer,
  movieItem: movieViewReducer,
  homePage: homePageReducer,
  user: userReducer
});

export default rootReducer;
