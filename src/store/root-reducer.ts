import { combineReducers } from "redux";
import movieViewReducer from "./movie-view/movie-view.reducer";
import userReducer from "./user/user.reducer";
import makeMoviesBrowserReducer from "./movies-browser/movies-browser.reducer";

const rootReducer = combineReducers({
  "trendingWeek"   : makeMoviesBrowserReducer("trendingWeek"),
  "nowPlaying"     : makeMoviesBrowserReducer("nowPlaying"),
  "watchlist"      : makeMoviesBrowserReducer("watchlist"),
  "favorite"       : makeMoviesBrowserReducer("favorite"),
  "search"         : makeMoviesBrowserReducer("search"),
  "user"           : userReducer,
  "movieItem"      : movieViewReducer,
});

export default rootReducer;
